
import { showToast } from "./Utils";
export const handleToastMessage = (error) => {
  const errorResponse = error?.error?.data;
  if (errorResponse?.message === "Validation errors" && errorResponse.data) {
    const firstErrorKey = Object.keys(errorResponse.data)[0]; // First field
    const firstErrorMessage = errorResponse.data[firstErrorKey][0]; // First error message
    showToast(firstErrorMessage, "error");
  } else {
    showToast(error?.error?.data?.message, "error");
 
    console.error("An unexpected error occurred.", error);
  }
};
 
export const getAuthorizationHeader = () => {
  const authToken = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${authToken}`, // Add "Bearer " prefix
    Accept: "application/json",
    // "Content-Type": "application/json",
  };
};
 
export const handleQueryError = async (queryFulfilled) => {
  try {
    await queryFulfilled;
  } catch (error) {
    handleToastMessage(error);
  }
};
 
export const handleQueryErrorAndSuccess = async (
  queryFulfilled,
  action,
  entityName
) => {
  try {
    await queryFulfilled;
    showToast(`${action} ${entityName} successfully!`, "success");
    console.log(`${entityName} ${action} successfully`);
    // Optionally add a toast here for success
  } catch (error) {
    handleToastMessage(error);
  }
};