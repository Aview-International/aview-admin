import { useState } from 'react';
import {
  Admin_Onboarding_Step_1,
  Admin_Onboarding_Step_2,
  Success,
} from '../../components/admin/CreateAdmin';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import PageTitle from '../../components/SEO/PageTitle';

const CreateAdmin = () => {
  const [stage, setStage] = useState('stage1');
  const [payload, setPayload] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    phone: '',
    role: '',
  });
  return (
    <>
      <PageTitle title="Translation" />
      <div className="text-white">
        <h2 className="text-6xl">Onboard a new admin</h2>
        {stage === 'stage1' && (
          <Admin_Onboarding_Step_1
            setStage={setStage}
            setPayload={setPayload}
            payload={payload}
          />
        )}
        {stage === 'stage2' && (
          <Admin_Onboarding_Step_2
            setPayload={setPayload}
            payload={payload}
            setStage={setStage}
          />
        )}
        {stage === 'success' && <Success />}
      </div>
    </>
  );
};

CreateAdmin.getLayout = DashboardLayout;

export default CreateAdmin;
