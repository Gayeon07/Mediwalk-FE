import PersonIcon from "../../assets/icons/person_fill.svg?react";
import MoneyIcon from "../../assets/icons/money_fill.svg?react";
import LocationIcon from "../../assets/icons/location_fill.svg?react";
import BellIcon from "../../assets/icons/noti_fill.svg?react";
import SheildIcon from "../../assets/icons/sheild_fill.svg?react";
import SettingIcon from "../../assets/icons/setting_fill.svg?react";
import InfoIcon from "../../assets/icons/info_fill.svg?react";
import QuestionIcon from "../../assets/icons/question_fill.svg?react";
import ArrowIcon from "../../assets/icons/arrow2_right.svg?react";
import Badge from "../../components/Badge";

const ICON_COMPONENTS = {
  person: PersonIcon,
  account: MoneyIcon,
  location: LocationIcon,
  notification: BellIcon,
  security: SheildIcon,
  setting: SettingIcon,
  info: InfoIcon,
  question: QuestionIcon,
} as const;

type IconType = keyof typeof ICON_COMPONENTS;

interface SettingListItemProps {
  icon: IconType;
  title: string;
}

const SettingListItem = ({ icon, title }: SettingListItemProps) => {
  const IconComponent = ICON_COMPONENTS[icon];
  return (
    <div className="flex justify-between items-center bg-common-white py-3">
      <div className="flex gap-2 items-center">
        <IconComponent className="w-5 h-5 text-cool-neutral-60" />
        <div className="flex items-center gap-1">
          <span className="text-body1_m_16">{title}</span>
          {/* icon 문자열이 "account"일 때만 Badge 렌더링 */}
          {icon === "account" && <Badge text="환급용" />}
        </div>
      </div>
      <ArrowIcon className="w-5 h-5 text-cool-neutral-30" />
    </div>
  );
};

export default SettingListItem;
