import { useState } from 'react';
import { useForm } from 'react-hook-form';
import QRScanner from './QRScanner';

const PatientRegistration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [step, setStep] = useState(1);
  const [qrData, setQrData] = useState(null);

  const onSubmit = (data) => {
    // console.log(data);
    setStep(3);
  };

  return (
    <div className="registration-container">
      {step === 1 && (
        <QRScanStep onScanComplete={(data) => { setQrData(data); setStep(2); }} />
      )}

      {step === 2 && (
        <FormStep
          qrData={qrData}
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}

      {step === 3 && <SuccessStep qrId={qrData?.id || 'HOSP-'+Date.now()} />}
    </div>
  );
};


export default PatientRegistration;
