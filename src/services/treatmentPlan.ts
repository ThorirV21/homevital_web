import { TreatmentType } from "@/types/treatmentTypes";

const selectDays = (days: number) => {
  const daysArray = [];
  if (days === 1) {
    daysArray.push(1, 0, 0, 0, 0, 0, 0);
  } else if (days === 2) {
    daysArray.push(1, 0, 0, 1, 0, 0, 0);
  } else if (days === 3) {
    daysArray.push(1, 0, 1, 0, 1, 0, 0);
  } else if (days === 4) {
    daysArray.push(1, 1, 0, 1, 1, 0, 0);
  } else if (days === 5) {
    daysArray.push(1, 1, 1, 1, 1, 0, 0);
  } else if (days === 6) {
    daysArray.push(1, 1, 1, 1, 1, 1, 0);
  } else if (days === 7) {
    daysArray.push(1, 1, 1, 1, 1, 1, 1);
  }
  return daysArray;
};

const mergeMeasurementDays = (...arrays: number[][]): number[] => {
  const mergedArray: number[] = new Array(7).fill(0);

  arrays.forEach((array) => {
    array.forEach((value, index) => {
      if (value === 1) {
        mergedArray[index] = 1;
      }
    });
  });

  return mergedArray;
};

const selectedDates = (treatment: TreatmentType) => {
  const startDate = new Date(treatment.startDate);
  let endDate = new Date();
  if (!treatment.endDate) {
    endDate = new Date(startDate.getDate() + 365);
    console.log("no end date", endDate);
  } else {
    endDate = new Date(treatment.endDate);
    console.log("end date", endDate);
  }

  const mergedMeasurementDays = mergeMeasurementDays(
    treatment.weightMeasurementDays,
    treatment.bloodSugarMeasurementDays,
    treatment.bloodPressureMeasurementDays,
    treatment.oxygenSaturationMeasurementDays,
    treatment.bodyTemperatureMeasurementDays
  );

  const datesArray: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayIndex = currentDate.getDay();
    const correctedIndex = (dayIndex + 6) % 7;
    if (mergedMeasurementDays[correctedIndex] === 1) {
      datesArray.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return datesArray;
};

export { selectedDates, selectDays };
