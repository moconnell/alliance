import { useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../components/Input";
import { useCalendar } from "../../hooks";
import DaysOfWeek from "../../types/daysOfWeek";
import Time from "../../types/time";

const Preferences = () => {
  const { address, availability, profile, setProfileAvailability } = useCalendar();

  const defaultValues = useMemo(() => {
    const defaultValues = { ...profile, ...availability };
    if (!defaultValues.availableDays)
      defaultValues.availableDays = DaysOfWeek.MonFri;
    if (!defaultValues.from) defaultValues.from = { hours: 9, minutes: 0 } as Time;
    if (!defaultValues.to) defaultValues.to = { hours: 12, minutes: 0 } as Time;
    if (!defaultValues.timeZone)
      defaultValues.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!defaultValues.location)
      defaultValues.location = defaultValues.timeZone.split("/")[1];

    return defaultValues;
  }, [availability, profile]);

  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (!address) {
    return <Navigate to="/" />;
  }

  return (
    <FormProvider {...methods}>
      <form aria-label="form" onSubmit={handleSubmit(setProfileAvailability)}>
        <Input />
      </form>
    </FormProvider>
  );
};

export default Preferences;
