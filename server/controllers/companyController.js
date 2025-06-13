import Company from "../models/company.js";
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/job.js";

// Register  a new company
export const registerCompany = async (req, res) => {
    const {name, email, password} = req.body

    const imageFile = req.file;
    if(!name || !email || !password || !imageFile){
        return res.json({success:false, message: "Missing Details"})
    }
    try{
        const companyExists = await Company.findOne({email})

        if(companyExists){
            return res.json({success: false, message: 'Company already registered'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

// Company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body
    try{
        const company = await Company.findOne({email})
        // if(!company){
        //     return res.json({ success: false, message: "Invalid email of password"})
        // }
        const isMatch = await bcrypt.compare(password, company.password);
        if(isMatch){
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token:generateToken(company._id)
            })
        }else{
            res.json({success: false, message: "Invalid Email or password"})
        }
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

// Get company data
export const getCompanyData = async (req, res) => {

}

// Post a new Job
export const postJob = async (req, res) => {

    const {title, description, location, salary, level, category} = req.body

    const companyId = req.company._id

    // console.log(companyId, {title, description, location, salary, level, category});
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        res.json({success:true, job: newJob})

    } catch (error) {

        res.json({success: false, message: error.message})

    }

}

// Get company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {

}

// Get company posted Jobs
export const getCompanyPostedJobs = async (req, res) => {

}

// Change Job application status
export const ChangeJobApplicationStatus = async (req, res) => {

}

// Change job visiblity
export const changeVisiblity = async (req, res) => {

}