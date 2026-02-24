import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function ApkUploadPage() {
  const [file, setFile] = useState(null);
  const [latestVersion, setLatestVersion] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setResponseMsg("Please select an APK file");
      return;
    }

    setLoading(true);
    setResponseMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("latest_version", latestVersion);
    formData.append("force_update", forceUpdate);

    try {
      const res = await axiosInstance.post("/api/app/version/upload-apk-version", formData);

      const data = res.data;
      if (data.success) {
        setResponseMsg("APK Uploaded & Version Updated Successfully!");
        fetchCurrent();
      } else {
        setResponseMsg(data.message || "Something went wrong");
      }
    } catch (error) {
      setResponseMsg("Upload failed. Check console.");
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCurrent();
  }, []);

  const [current, setCurrent] = useState(null);

  const fetchCurrent = async () => {
    try {
      const res = await axiosInstance.get("/api/app/version");
      setCurrent(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">APK Upload & Version Update</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Input */}
          <div>
            <label className="block mb-1 font-medium">Select APK File</label>
            <input
              type="file"
              accept=".apk"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          {/* Version */}
          <div>
            <label className="block mb-1 font-medium">Latest Version</label>
            <input
              type="text"
              placeholder="e.g. 2.1.0"
              value={latestVersion}
              onChange={(e) => setLatestVersion(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>

          {/* Force Update */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={forceUpdate}
              onChange={(e) => setForceUpdate(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="font-medium">Force Update</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Uploading..." : "Upload & Save Version"}
          </button>
        </form>

        {/* Response Message */}
        {responseMsg && (
          <p className="mt-4 text-center font-medium text-green-600">{responseMsg}</p>
        )}
              {/* Current Version Table */}
        {current && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3 text-center">Current App Version</h3>
            <table className="w-full border border-gray-300 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 border">Version</th>
                  <th className="p-3 border">APK URL</th>
                  <th className="p-3 border">Force Update</th>
                  <th className="p-3 border">Updated At</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">{current.latest_version}</td>
                  <td className="p-3 border text-blue-600 break-all"><a href={current.apk_url} target="_blank">{current.apk_url}</a></td>
                  <td className="p-3 border">{current.force_update ? "Yes" : "No"}</td>
                  <td className="p-3 border">{new Date(current.updatedAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}