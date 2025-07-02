import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import FormInput from '../../components/FormComponents/FormInput';
import ErrorHandler from '../../utils/errorHandler';
import { createContentCreator } from '../../services/api';
import DashboardButton from '../../components/UI/DashboardButton';
import { toast } from 'react-toastify';

const ContentCreators = () => {
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState({
    name: '',
    username: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreator((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!creator.name || !creator.username)
        throw new Error('Please fill all fields');
      await createContentCreator(creator);
      toast.success('Content creator created successfully');
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      setCreator({ name: '', username: '' });
    }
  };

  return (
    <div>
      <h2 className="mb-s4">Create new content creator</h2>
      <form className="w-full max-w-[450px]">
        <FormInput
          value={creator.username}
          onChange={handleInputChange}
          name="username"
          placeholder="Username"
          _id="username"
          label="Username"
          type="text"
          autoComplete="off"
        />
        <br />
        <br />
        <FormInput
          value={creator.name}
          onChange={handleInputChange}
          name="name"
          placeholder="Creator's Name"
          _id="name"
          label="Creator's Name"
          type="text"
          autoComplete="off"
        />
        <br />
        <div className="mx-auto w-[200px]">
          <DashboardButton isLoading={loading} onClick={handleSubmit}>
            Create Creator
          </DashboardButton>
        </div>
      </form>
      <br />
      <div>Existing Creators</div>
    </div>
  );
};

ContentCreators.getLayout = DashboardLayout;

export default ContentCreators;
