import logo from './logo.svg';
import './App.css';
import {Octokit} from "octokit";
import {useEffect, useState} from "react";
import {
    Avatar,
    Box, Button,
    Card, CardActions, CardContent,
    Chip,
    Container,
    Divider, Grid,
    IconButton,
    List,
    ListItem,
    Stack,
    Switch,
    Typography
} from "@mui/material";



// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: ''
})


function App() {
    const [state, setState] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {//https://github.com/search?
        octokit.request('GET /search/repositories?q=stars%3A%3E%3D100+created%3A%3E%3D2023-03-24+forks%3A0&type=repositories&s=stars&o=desc', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            per_page: 100

        }).then(r => {
            setState(r.data);
            setLoading(false);
        })
    }, [])
    if (!isLoading) {
        return (
            <Container component="main" maxWidth="md">
                <center>
                    <Typography variant="h2">
                        Repo Hijack List
                    </Typography>
                </center>
                <div style={{ padding: 30 }} >
                    {state.items.map((item) =>
                        <Card sx={{minWidth: 275}}>
                            <CardContent>
                                <Typography sx={{fontSize: 18}} color="text.secondary" gutterBottom>
                                    {item.name}
                                </Typography>
                                <Typography sx={{mb: 1.5}} color="text.secondary">
                                    Tags
                                </Typography>
                                {item.topics.map( zz=> {return <Chip label={zz} variant="outlined"/>})}
                            </CardContent>
                            <CardActions>
                                <Button size="small">Link</Button>
                            </CardActions>
                        </Card>
                    )}
                </div>
            </Container>
        );
    } else {
        <div className="App">Loading...</div>

    }
}

export default App;
