interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleButton = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11.5 h-6 flex items-center rounded-full transition-colors duration-300 ${
        isOn ? "bg-primary" : "bg-neutral-90"
      }`}
    >
      {/* 토글 내부의 하얀 원 */}
      <div
        className={`w-5 h-5 bg-white rounded-full transform transition-transform duration-300 ${
          isOn ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
