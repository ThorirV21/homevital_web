import { useEffect, useState } from "react";
import TreatmentForm from "@/components/treatments/form";
import { Button } from "../ui/button";
import { usePatientTreatments } from "@/hooks/useTreatments";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { TreatmentType } from "@/types/treatmentTypes";
import TreatmentDisplay from "../treatments/treatmentDisplay";
const Treatment = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState("current");
  const [createNew, setCreateNew] = useState(false);
  const { data, error, isLoading } = usePatientTreatments(id);
  const [activeTreatment, setActiveTreatment] = useState<TreatmentType | null>(
    null
  );

  /*   useEffect(() => {
    setActiveTreatment({
      id: 1,
      name: "Framhalds eftirlit",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      patientID: 1,
      isActive: true,
      instructions:
        "Skráðu súrefnismettun, þyngd og blóðþrýsting einu sinni í viku.  Fínt að gera það að morgni til þegar þú vaknar.",
      weightMeasurementFrequency: 0,
      bloodSugarMeasurementFrequency: 1,
      bloodPressureMeasurementFrequency: 2,
      oxygenSaturationMeasurementFrequency: 3,
      bodyTemperatureMeasurementFrequency: 4,
    });
  }, []); */

  useEffect(() => {
    if (data) {
      setActiveTreatment(
        data.find((treatment: TreatmentType) => treatment.isActive)
      );
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  console.log(data);

  const currentTreatment = data?.find(
    (treatment: TreatmentType) => treatment.isActive
  );

  console.log("Current treatment", currentTreatment);

  const buttonClasses = "h-7";
  return (
    <div className="px-4 flex-1 overflow-hidden">
      <div className="flex flex-row py-4 items-center">
        <Button
          className={`${buttonClasses} rounded-r-none ${activeTab === "current" ? "" : "opacity-50"}`}
          onClick={() => setActiveTab("current")}
        >
          Núverandi
        </Button>
        <Button
          className={`${buttonClasses} rounded-l-none ${activeTab === "previous" ? "" : "opacity-50"}`}
          onClick={() => setActiveTab("previous")}
        >
          Fyrri áætlanir
        </Button>
        <Button className=" ml-auto" onClick={() => setCreateNew(true)}>
          Skrá nýja
        </Button>
      </div>
      <div className="h-[calc(100vh-21rem)] border border-primary overflow-scroll">
        {createNew ? (
          <TreatmentForm id={id} />
        ) : activeTreatment ? (
          <TreatmentDisplay treatment={activeTreatment} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Treatment;
