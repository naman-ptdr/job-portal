import { createContext, useState} from "react";
import { jobsData } from "../assets/assets";
import { useEffect } from "react";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])
    // function to fetch jobs
    const fetchJobs = async () => {
        setJobs(jobsData)
    }

    useEffect(()=>{
        fetchJobs()
    }, [])


    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs
    }
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}