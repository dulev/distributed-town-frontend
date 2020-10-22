import {
  MagicContext,
  LoggedInContext,
  UserInfoContext,
  TokenContext
} from "../components/Store";

import { useContext, useState, useEffect } from "react";
import SkillsCard from "../components/SkillsCard";

import Button from "../components/Button";
import { useRouter } from "next/router";
import NicknameSelection from "../components/NicknameSelection";

function SignupPhaseOne(props) {
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext);
  const [userInfo, setUserInfo] = useContext(UserInfoContext);
  //const [categories, setCategories] = useState([]);
  const [skillTree, setSkillTree] = useState ([]);
  const [token, setToken] = useContext(TokenContext);
  const [selectedSkillsIndexes, setSelectedSkillsIndexes] = useState([]);
  const backgroundImageStyle = {
    backgroundImage: `url(${userInfo.background})`,
    //filter: 'blur(8px)',
   // WebkitFilter: 'blur(8px)',
   
   
  };


  useEffect(() => {
   
    const getSkillTree = async () => {
      try{
      
      const response = await fetch(`http://localhost:3005/api/skill?skill=${userInfo.category}`, { method: "GET" });
      const skillTree = await response.json();
      const skillTreeCategories = skillTree.categories;
      setSkillTree(skillTreeCategories);
      
      } catch(err) {
          console.log(err);
      }
    }
    getSkillTree();


  } , []);

  const  selectSkill = (categoryIndex, selectedSkillIndex) => {
     
    const  updateSkills = (category) => category.skills.map((skill, skillIndex) => {
      if (skillIndex === selectedSkillIndex) {
        const newSkill = typeof skill === 'string'  ?  {skill, selected: !skill.selected} : {...skill, selected: !skill.selected};
        return {...newSkill}
     } 
        
        return typeof skill==='string' ? {skill}: {...skill};
     });
 
   const copySkills = (category) => category.skills.map((skill) => {
       return typeof skill ==='string' ? {skill} : {...skill};
   ;});


  const  updateSkillTree = (_skillTree) => _skillTree.map((category,i) => {
    if(i === categoryIndex){
    return{...category,
        skills: updateSkills(category)
         };
     }
     return {
       ...category,
          skills: copySkills(category)
       };
     });
   
     setSkillTree(updateSkillTree(skillTree));
    }


  function setSkillLevel(catIndex, skillIndex, level) {
          const updateSkills = (category) => category.skills.map((skill, skIndex) => {
            if (skIndex === skillIndex) {
              return {skill, level };
            }
            return {skill};
          });

          const copySkills = (category) => category.skills.map((skill) => {
            return {skill}
          })
  
            const updateSkillTree = (_skillTree) =>
                _skillTree.map((category, categoryIndex) => {
              if (categoryIndex === catIndex) {
                return {
                  ...category,
                  skills: updateSkills(category),
                };
              }
                return {
                ...category,
                  skills: copySkills(category)
                };
            })
       setSkillTree(updateSkillTree(skillTree));
    }

  function getSelectedSkills() {
    let skills = [];

    if (skillTree.length === 0) return <></>;

    for (let category of skillTree) {
      for (let skill of category.skills) {
        if (skill){
          if(typeof skill.selected !== 'undefined' && skill.selected){
          skills.push({ skill: skill.skill, level: typeof skill.level === 'undefined' ? 0 : skill.level });
            } 
          }
        }
    }

    console.log('los skills',skills);

    return (skills.length > 0 ? skills.map(({ skill, level }, i) => {
      
      return (
        <div className="flex justify-between" key={i}>
          <p>{skill ? skill.skill : ''}</p>
          <p>{skill ? skill.level : ''}</p>
        </div>
      );
    }) : <></>)
  }

  function setUserSkills() {
    let skills = [];

    for (let category of skillTree ) {
      for (let skill of category.skills) {
        if (skill[1])
          skills.push({
            skill: skill,
            level: skill[2] / 10,
            redeemableDitos: (skill[2] / 10) * category.ditoMultFactor,
          });
      }
    }

    setUserInfo((userInfo) => {
      return { ...userInfo, skills };
    });
    
  }

  const router = useRouter();

  useEffect(() => {
    if (userInfo.skills.length > 0) {
      
      router.push("/SignupPhaseTwo");
    }
  }, [userInfo.skills.length]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row min-h-screen">
        <div style={backgroundImageStyle} className="flex flex-col w-1/2 space-y-8 p-8 flex-grow-0  h-full">
            <NicknameSelection 
               setUserInfo={setUserInfo}
               value={userInfo.nickname}
               title="Welcome to Distributed Town!"
               subtitle="This is the first step to join a global community of local people or the other way around :)"
               placeholderText = "Please choose a nickname"
               userInfo = {userInfo}
            />
        </div>
        <div className="flex flex-col space-y-1 p-8 flex-grow">
          <h1>Tell us about you!</h1>
          <p>Pick your Skills (between 1 and 3)</p>
          <p>Select what you’re the best at, and receive Credits for it.</p>
          {skillTree.map((category, i) => {
         
            return (
              <SkillsCard
                key={i}
                title={category.subCat}
                skills={category.skills}
                selectSkill={(skillSelectedIndex) => selectSkill(i, skillSelectedIndex)}
                setSkillLevel={(skillIndex, skillLevel) =>
                  setSkillLevel(i, skillIndex, skillLevel)
                }
              />
            );
          })}
          <div className="bg-blue-600 flex flex-row items-center justify-between p-4 text-white">
            <p>Your selection</p>
            <div>{getSelectedSkills()}</div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 right-0 left-0 flex justify-center items-center">
        <Button onClick={() => setUserSkills()}>
          Next: choose your first community!
        </Button>
      </div>
    </div>
  );
}

export default SignupPhaseOne;