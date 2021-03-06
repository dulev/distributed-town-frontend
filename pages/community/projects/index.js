import {
    MagicContext,
    LoggedInContext,
    TokenContext,
    UserInfoContext,
} from "../../../components/Store";
import ProjectCard from "../../../components/project/ProjectCard"
import SkillsDisplay from "../../../components/SkillsDisplay"

import { useContext, useState, useEffect } from "react";

import Link from 'next/link'
import Layout from "../../../components/Layout";

function Projects() {
    const [token, setToken] = useContext(TokenContext);
    const [userInfo, setUserInfo] = useContext(UserInfoContext);
    const [projects, setProjects] = useState();

    useEffect(() => {
        async function fetchProjects() {
            try {
                let resFetchProjects = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/gig?isOpen=true&isProject=true`,
                    {
                        method: "GET",
                        headers: new Headers({
                            Authorization: "Bearer " + token,
                        }),
                    }
                );
                const openProjectsResp = await resFetchProjects.json();
                setProjects(openProjectsResp);
            } catch (err) {
                console.log(err);
            }
        }
        fetchProjects();
    }, []);

    // const projects = [
    //     { _id: "1", projectTitle: "Test project 1", projectDescription: "Test description", skillsNeeded: ["skill 1", "skill 2"], fundsNeeded: 10 },
    //     { _id: "2", projectTitle: "Test project 2", projectDescription: "Another Test description", skillsNeeded: ["skill 3", "skill 2"], fundsNeeded: 1000 },
    //     { _id: "3", projectTitle: "Test project 3", projectDescription: "Test description", skillsNeeded: ["skill 1", "skill 3"], fundsNeeded: 20 },
    //     { _id: "4", projectTitle: "Test project 4", projectDescription: "Test description Test description Test description Test description", skillsNeeded: ["skill 1", "skill 4"], fundsNeeded: 40 },
    // ]

    return (
        <Layout
            navBar
            flex
            logo
            splash={{
                color: "blue",
                variant: "default",
                alignment: "left",
                isTranslucent: false,
                fullHeight: false
            }}
        >
            <div className="flex">
                <div className="m-12 w-full overflow-scroll">
                    <h1 className="underline text-black text-4xl">Open Projects</h1>
                    <div className="mt-5 grid grid-cols-3 gap-12 items-baseline mb-40">
                        {typeof projects === "undefined" ? (
                            <div>
                                <h2>Loading projects...</h2>
                            </div>
                        ) : projects.length === 0 ? (
                            <h2>There are no open projects.</h2>
                        ) : (projects.map((project) => {
                            return (
                                <ProjectCard key={project._id} project={project} />
                            );
                        })
                                )}
                    </div>
                </div>
                <div className="flex w-10/12 px-10 mb-8 mt-12 fixed bottom-0 bg-white">
                    <Link href='/community/projects/create'>
                        <div className="flex py-5 justify-center w-2/6 mr-20 border-2 border-blue-600">
                            <a className="flex flex-col items-center">
                                <p className="text-2xl mb-2">Create new project</p>
                                <img src="/plusbutton.svg" />
                            </a>
                        </div>
                    </Link>
                    <SkillsDisplay skills={userInfo.skills} />
                </div>
            </div>
        </Layout>
    );
}

export default Projects;
