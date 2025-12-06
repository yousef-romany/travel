const axios = require('axios');

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

async function debugPrograms() {
    const query = "Luxor";
    const limit = 10;
    const url = `${API_URL}/api/programs?populate=images&filters[$or][0][title][$containsi]=${query}&filters[$or][1][Location][$containsi]=${query}&pagination[limit]=${limit}`;

    console.log("Fetching URL:", url);

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });

        console.log("Response Status:", response.status);
        console.log("Total Programs Found:", response.data.meta.pagination.total);
        console.log("Programs Returned:", response.data.data.length);

        response.data.data.forEach(p => {
            console.log(`- ID: ${p.id}, Title: ${p.title}, Location: ${p.Location}`);
        });

    } catch (error) {
        console.error("Error fetching programs:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

debugPrograms();
