import axios from "axios";


const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const url = `http://127.0.0.1:8000/fen_from_image/?corner_conf=${cornerConf}&pieces_conf=${piecesConf}`;

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFen(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while fetching FEN.");
      setFen(null);
    }
  };