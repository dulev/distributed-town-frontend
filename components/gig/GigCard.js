import Card from '../Card';
import Button from '../Button';

const GigCard = ({ key, gig, takeGig, isLoading }) => {
  return (
    <Card key={key} className="flex flex-col gap-3">
      <div className="flex justify-between border-b-2 border-gray-400 p-2">
        <p>{gig.title}</p>
        <p>
          <span className="text-carrot">DiTo offered:</span>{' '}
          {gig.creditsOffered}
        </p>
      </div>
      <p className="pb-2 border-b-2 border-gray-400">{gig.description}</p>
      <div>
        <p>Skills needed: </p>
        <ul>
          {gig.skills.map((skill, j) => (
            <li key={j} className="list-disc list-inside">
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="button"
        loading={isLoading}
        onClick={() => takeGig(gig._id)}
      >
        Take Gig
      </Button>
    </Card>
  );
};

export default GigCard;
