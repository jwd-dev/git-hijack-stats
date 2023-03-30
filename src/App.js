import logo from './logo.svg';
import './App.css';
import {Octokit} from "octokit";
import { ThemeOptions } from '@mui/material/styles';

import {useEffect, useState} from "react";
import {
    Avatar,
    Box, Button,
    Card, CardContent,
    Chip,
    Container, createTheme,
    Divider, Grid,
    IconButton, Link,
    List,
    ListItem, Paper,
    Stack,
    Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import {randomNumberBetween} from "@mui/x-data-grid/utils/utils";
import {checkNode} from "@testing-library/jest-dom/dist/utils";


export const themeOptions = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: ''
})


function App() {
    let key = 0;
    const [state, setState] = useState([]);
    const [count, setCount] = useState([]);

    const [isLoading, setLoading] = useState(true);
    function createData(
        name,
        topics,
        stars
    ) {
        return { name, topics, stars };
    }
    useEffect(() => {//https://github.com/search?
        octokit.request('GET /search/repositories?q=stars%3A%3E%3D100+created%3A%3E%3D2023-03-24+forks%3A0&type=repositories&s=stars&o=desc', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            },
            per_page: 100

        }).then(r => {
            let thisData = [];
            r.data.items.map((repo)=>
                octokit.request('GET /repos/{owner}/{repo}/readme', {
                    owner: repo.owner.login ,
                    repo: repo.name,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                }).then(r => thisData.push(createData(repo.name, repo.topics, repo.stargazers_count)))
                )
            setState(r.data.items);
            setCount(r.data.total_count);
            setLoading(false);
        })
    }, [])
    if (!isLoading) {
        return (

            <ThemeProvider theme={themeOptions}>
            <Container component="main" maxWidth="md" >
                <center>
                    <Typography variant="h2" color={"white"}>
                        Repo Hijack List
                    </Typography>
                    <br />
                        <Typography variant="subtitle1" color={"white"}>
                            Currently there are: {count} potentially malicious repositories
                        </Typography>
                </center>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Repo Name</TableCell>
                                <TableCell align="right" >Owner</TableCell>
                                <TableCell align="right" >Stars</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.map((row) =>
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Link href={row.html_url}>
                                        {row.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{row.owner.login}</TableCell>

                                    <TableCell align="right">{row.stargazers_count}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            </ThemeProvider>
        );
    } else {
        <div className="App">Loading...</div>

    }
}

export default App;
