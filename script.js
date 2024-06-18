require('dotenv').config();

async function executeETLJob() {
   const jobDropdown = document.getElementById("etlJobs");
   const selectedJob = jobDropdown.value;
   const tenantId = process.env.TENANT_ID;
   const clientId = process.env.CLIENT_ID;
   const clientSecret = process.env.CLIENT_SECRET;
   const subscriptionId = process.env.SUBSCRIPTION_ID;
   const resourceGroupName = "JDE_NAA_UAT";
   const factoryName = "jdenaauatadf";
   const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/token`, {
       method: "POST",
       headers: {
           "Content-Type": "application/x-www-form-urlencoded"
       },
       body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&resource=https://management.azure.com/`
   });
   const tokenData = await tokenResponse.json();
   const accessToken = tokenData.access_token;
   const pipelineName = selectedJob; // Assuming your pipeline names match the dropdown values
   const response = await fetch(`https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/pipelines/${pipelineName}/createRun?api-version=2018-06-01`, {
       method: "POST",
       headers: {
           "Authorization": `Bearer ${accessToken}`,
           "Content-Type": "application/json"
       }
   });
   if (response.ok) {
       alert(`Pipeline ${pipelineName} has been triggered successfully!`);
   } else {
       const error = await response.json();
       alert(`Error triggering pipeline: ${error.message}`);
   }
}