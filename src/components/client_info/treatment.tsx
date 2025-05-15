import { useEffect, useState } from "react";
import TreatmentForm from "@/components/treatments/form";
import { Button } from "../ui/button";
import { usePatientTreatments } from "@/hooks/useTreatments";
import Loading from "@/components/loading";
import Error from "@/components/error";
import { TreatmentType } from "@/types/treatmentTypes";
import TreatmentDisplay from "../treatments/treatmentDisplay";
import formatDateIS from "@/services/dateFormatter";

const Treatment = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState("current");
  const [createNew, setCreateNew] = useState(false);
  const { data, error, isLoading } = usePatientTreatments(id);
  const [activeTreatment, setActiveTreatment] = useState<TreatmentType | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setActiveTreatment(
        data.find((treatment: TreatmentType) => treatment.isActive) ?? null
      );
    }
  }, [data]);

  useEffect(() => {
    if (activeTreatment) {
      setActiveTab("current");
    } else {
      setActiveTab("previous");
    }
  }, [activeTreatment]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const buttonClasses = "h-7 text-xs shadow-none";
  return (
    <div className="px-4 flex-1 overflow-hidden">
      <div className="flex flex-row py-4 w-full items-center justify-between">
        <div className="bg-buttoncontainer rounded-md p-1 shadow-md">
          <Button
            className={` ${buttonClasses} ${activeTab === "current" ? "" : "bg-opacity-100"}`}
            onClick={() => setActiveTab("current")}
          >
            Núverandi
          </Button>
          <Button
            className={`${buttonClasses} ${activeTab === "previous" ? "" : "bg-opacity-100"}`}
            onClick={() => setActiveTab("previous")}
          >
            Fyrri áætlanir
          </Button>
        </div>
        <Button className="" onClick={() => setCreateNew(true)}>
          Skrá nýja
        </Button>
      </div>
      <div className="h-[calc(100vh-21rem)] border border-primary overflow-scroll">
        {createNew ? (
          <TreatmentForm id={id} setCreateNew={setCreateNew} />
        ) : activeTreatment && activeTab === "current" ? (
          <TreatmentDisplay treatment={activeTreatment} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary">
                <th className="p-2 text-left">Nafn</th>
                <th className="p-2 text-left">Upphafsdagur</th>
                <th className="p-2 text-left">Lokadagur</th>
                <th className="p-2 text-left">Virk</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((treatment: TreatmentType) => {
                const startDate = formatDateIS(treatment.startDate);
                const endDate = formatDateIS(treatment.endDate);
                return (
                  <tr key={treatment.id} className="border-b border-primary">
                    <td className="p-2 text-left">{treatment.name}</td>
                    <td className="p-2 text-left">{startDate}</td>
                    <td className="p-2 text-left">{endDate}</td>
                    <td className="p-2 text-left">
                      {treatment.isActive ? "Já" : "Nei"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Treatment;
