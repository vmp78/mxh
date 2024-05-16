import { Button, Flex, Input, Textarea } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        postedBy: '',
        text: '',
        img: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            img: e.target.files[0],
        });
    };

    const handleCreatePost = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = new FormData();
            data.append('postedBy', formData.postedBy);
            data.append('text', formData.text);
            if (formData.img) {
                data.append('img', formData.img);
            }

            // Replace '/api/posts/create' with your actual endpoint
            const response = await axios.post('http://localhost:4000/api/posts/create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Post created successfully:', response.data);
            // Handle the response, e.g., display a success message or update the UI
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        handleCreatePost();
        setShowForm(false);
    };

    return (
        <Flex direction="column" w="full" align="center" gap={4}>
            <Link to={'/top1pdp2k3'} >
                <Button mx='auto'>Visit Profile Page</Button>
            </Link>
            <Button 
                mx='auto' 
                onClick={() => setShowForm(true)} 
                isDisabled={loading}
            >
                Create Post
            </Button>
            {showForm && (
                <Flex direction="column" gap={2} p={4} border="1px solid #ccc" borderRadius="md">
                    <Input
                        placeholder="Posted by"
                        name="postedBy"
                        value={formData.postedBy}
                        onChange={handleInputChange}
                    />
                    <Textarea
                        placeholder="Text"
                        name="text"
                        value={formData.text}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="file"
                        name="img"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <Button 
                        onClick={handleSubmit} 
                        isLoading={loading}
                    >
                        OK
                    </Button>
                </Flex>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Flex>
    );
};

export default HomePage;
