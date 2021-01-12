import Card from './Card';

const SkillsDisplay = ({ skills = [] }) => {
  return (
    <Card>
      <h2 className="text-2xl text-center text-bold">Your skills</h2>
      <div className="grid justify-center grid-cols-2 gap-6 p-2">
        {skills.map((skill, i) => {
          const barcss = `font-bold text-white pr-2 text-right transition-all ease-out duration-1000 h-full bg-denim relative`;
          return (
            <div key={i}>
              <p className="text-center"> {skill.skill}</p>
              <div className="relative w-full h-8 mb-3 overflow-hidden border-2 rounded-full border-denim">
                <div className="absolute w-full h-full bg-white" />
                <div
                  id="bar"
                  className={barcss}
                  style={{ width: `${skill.level}%` }}
                >
                  {skill.level}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SkillsDisplay;
