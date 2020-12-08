import { useRouter } from 'next/router';
import { useCreateUser } from '../../hooks/useCreateUser';
import SkillPicker from '../../components/SkillPicker';

function PickSkills() {
  const router = useRouter();
  const { categorySkill } = router.query;
  const [createUser] = useCreateUser();

  const onSubmit = async ({ username, skills }) => {
    await createUser({ username, communityID: '', skills });
    await router.push('/signup/choose-community');
  };

  return <SkillPicker categorySkill={categorySkill} onSubmit={onSubmit} />;
}

export default PickSkills;
