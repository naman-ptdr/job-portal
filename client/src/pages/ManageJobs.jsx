import React, { useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState(false);
  const { backendUrl, companyToken } = useContext(AppContext);

  // Function to fetch company job Applications data
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobsData.reverse()); // for latest jobs first in the array
        console.log(data.jobsData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to change job visibility
  const changeJobVisiblity = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visiblity",
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return jobs ? (
    jobs.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm:text-2xl">No Jobs Available or Posted</p>
      </div>
    ) : (
      <div className="container p-4 max-w-5xl">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  #
                </th>
                <th className="py-2 px-4 border-b text-left">Job Title</th>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  Date
                </th>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  Location
                </th>
                <th className="py-2 px-4 border-b text-center">Applicants</th>
                <th className="py-2 px-4 border-b text-left">Visible</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No jobs found.
                  </td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr key={index + 1} className="text-gray-700">
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-b">{job.title}</td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden">
                      {job.location}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {job.applicants}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        onChange={() => changeJobVisiblity(job._id)}
                        className="scale-125 ml-4"
                        type="checkbox"
                        checked={job.visible}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/dashboard/add-job")}
            className="bg-black text-white py-2 px-4 rounded"
          >
            Add New Job
          </button>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
