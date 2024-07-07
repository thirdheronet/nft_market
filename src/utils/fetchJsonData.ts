const fetchJsonData = async (cid: string) => {
    try {
        const response = await fetch(import.meta.env.VITE_PUBLIC_PINATA_HTTP_GATEWAY + cid);

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

export default fetchJsonData;