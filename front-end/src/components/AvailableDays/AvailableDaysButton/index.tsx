import "./styles.css";
import { useEffect, useState } from "react";
import DaysOfWeek from "../../../types/daysOfWeek";

interface AvailableDaysButtonProps {
  day: DaysOfWeek;
  selected?: boolean;
  onSelect?: (day: DaysOfWeek, selected: boolean) => void;
}

const AvailableDaysButton = ({
  day,
  selected = false,
  onSelect,
}: AvailableDaysButtonProps) => {
  const [active, setActive] = useState(selected);

  useEffect(() => {
    setActive(selected);
  }, [selected]);

  const handleClick = () => {
    const newActive = !active;
    setActive(newActive);
    if (onSelect) onSelect(day, newActive);
  };

  return (
    <div className="circle-wrapper" role="button" aria-pressed={active} onClick={handleClick}>
      <div className={active ? "name-wrapper-clicked" : "name-wrapper"}>
        <span className={active ? "clicked-dot" : "dot"}></span>
        {DaysOfWeek[day].substring(0, 3)}
      </div>
    </div>
  );
};

export default AvailableDaysButton;
