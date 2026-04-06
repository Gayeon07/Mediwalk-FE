import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Badge from "../../components/Badge";

// Icons
import ArrowRightIcon from "../../assets/icons/arrow2_right.svg?react";
import MoneyIcon from "../../assets/icons/money_fill.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import DateIcon from "../../assets/icons/date_fill.svg?react";
import PotIcon from "../../assets/icons/pot_badge.svg?react";
import ShoeIcon from "../../assets/icons/shoe_badge.svg?react";
import SaveIcon from "../../assets/icons/save_badge.svg?react";
import api from "../../api/axios";

const goalsData = [
  {
    title: "초보 환경 지킴이",
    description: "폐의약품 10회 이상 수거 완료",
    icon: <PotIcon width={24} height={24} />,
    iconBg: "bg-[#F3F6D3]",
    status: "달성",
  },
  {
    title: "건강한 걷기 전문가",
    description: "한 달 100,000보 이상 달성",
    icon: (
      <ShoeIcon
        width={24}
        height={24}
        fill="#4E83FF"
        className="text-primary"
      />
    ),
    iconBg: "bg-primary-extralight",
    status: "달성",
  },
  {
    title: "절약의 달인",
    description: "누적 50,000원 이상 적립",
    icon: <SaveIcon width={24} height={24} className="text-[#F2994A]" />,
    iconBg: "bg-[#FFF0E6]",
    status: "달성",
  },
  {
    title: "건강한 걷기 전문가",
    description: "한 달 100,000보 이상 달성",
    icon: (
      <ShoeIcon
        width={24}
        height={24}
        fill="#4E83FF"
        className="text-primary"
      />
    ),
    iconBg: "bg-primary-extralight",
    status: "",
  },
  {
    title: "절약의 달인",
    description: "누적 50,000원 이상 적립",
    icon: <SaveIcon width={24} height={24} className="text-[#F2994A]" />,
    iconBg: "bg-[#FFF0E6]",
    status: "",
  },
];

// API 응답용 타입
interface RewardTransaction {
  id: number;
  userId: number;
  eventId?: number;
  amount: number;
  transactionType: "ACCUMULATION" | "REFUND";
  transactionDate: string;
  description: string;
  bankName?: string;
  accountNumberMasked?: string;
}

// 화면 렌더링용 타입
interface FormattedTransaction {
  id: number;
  title: string;
  status: string;
  date: string;
  location: string;
  amount: string;
  isPositive: boolean;
}

const Reward = () => {
  const [activeTab, setActiveTab] = useState("달성 목표");

  const [transactionData, setTransactionData] = useState<
    FormattedTransaction[]
  >([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = 1; // 임시
        const response = await api.get(`/reward-transactions?userId=${userId}`);

        const rawData: RewardTransaction[] = response.data;

        // FormattedTransaction 형태로 가공
        const formattedTransactionData: FormattedTransaction[] = rawData.map(
          (data) => {
            const isAccumulation = data.transactionType === "ACCUMULATION";
            const dateObj = new Date(data.transactionDate || Date.now());
            const formattedDate = `${dateObj.getFullYear()}. ${String(dateObj.getMonth() + 1).padStart(2, "0")}. ${String(dateObj.getDate()).padStart(2, "0")}`;

            return {
              id: data.id,
              title: isAccumulation ? "폐의약품 수거" : "리워드 환급",
              status: isAccumulation ? "적립 완료" : "",
              date: formattedDate,
              location: isAccumulation
                ? data.description || "위치 정보 없음"
                : `${data.bankName || ""} ${data.accountNumberMasked || ""}`.trim(),
              amount: `${isAccumulation ? "+" : ""} ${data.amount.toLocaleString()}원`,
              isPositive: isAccumulation,
            };
          },
        );

        setTransactionData(formattedTransactionData);
      } catch (error) {
        console.error(
          "Failed to fetch transactions, loading fallback data:",
          error,
        );
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 px-5 pb-8 overflow-y-auto w-full max-w-[480px] mx-auto no-scrollbar">
        {/* Top Total Reward Card */}
        <section className="bg-primary rounded-[20px] p-[24px] text-common-white mt-2 mb-3 relative overflow-visible shadow-card">
          <div className="text-body2_m_14 text-[#E6EFFF] mb-1 opacity-90">
            총 적립 리워드
          </div>
          <div className="flex items-center justify-between mb-5">
            <div className="text-[28px] font-bold leading-tight tracking-tight">
              {50850} 원
            </div>
            <ArrowRightIcon className="w-5 h-5 text-common-white opacity-80" />
          </div>

          <button className="w-full bg-common-white text-primary text-sub3_sb_16 py-3.5 rounded-xl mb-3 relative flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer hover:bg-neutral-99 transition-colors">
            <MoneyIcon className="w-5 h-5 text-primary" />
            소모품 지원 신청하기
          </button>

          <div className="text-center text-[12px] flex items-center justify-center text-common-white font-medium opacity-80">
            최소 지원 금액 10,000원 <BulletIcon className="w-4 h-4" /> 지원
            수수료 무료
          </div>
        </section>

        {/* Two small cards */}
        <section className="flex gap-3 mb-8">
          <div className="flex-1 bg-common-white rounded-2xl p-4 shadow-card">
            <div className="flex items-center text-caption2_m_12 text-neutral-50 mb-1 gap-1">
              <DateIcon className="w-4 h-4 text-primary" />
              이번 달
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sub1_sb_18 text-neutral-5 text-[17px]">
                15,400 원
              </div>
              <ArrowRightIcon className="w-4 h-4 text-neutral-70" />
            </div>
            <div className="text-caption4_r_12 text-neutral-60 mt-2">
              지난 달 대비 +24%
            </div>
          </div>

          <div className="flex-1 bg-common-white rounded-2xl p-4 shadow-card">
            <div className="flex items-center text-caption2_m_12 text-neutral-50 mb-1 gap-1">
              <DateIcon className="w-4 h-4 text-primary" />
              누적 수거
            </div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sub1_sb_18 text-neutral-5 text-[17px]">
                18 회
              </div>
              <ArrowRightIcon className="w-4 h-4 text-neutral-70" />
            </div>
            <div className="text-caption4_r_12 text-neutral-60 mt-2">
              총 50,850원 적립
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="flex border-b border-neutral-95 mb-4">
          <button
            className={`flex-1 text-center py-3 text-sub3_sb_16 transition-colors relative cursor-pointer ${activeTab === "달성 목표" ? "text-neutral-5 font-bold" : "text-neutral-60"}`}
            onClick={() => setActiveTab("달성 목표")}
          >
            달성 목표
            {activeTab === "달성 목표" && (
              <div className="absolute bottom-[0] left-0 right-0 h-[2px] bg-neutral-5" />
            )}
          </button>
          <button
            className={`flex-1 text-center py-3 text-sub3_sb_16 transition-colors relative cursor-pointer ${activeTab === "적립 내역" ? "text-neutral-5 font-bold" : "text-neutral-60"}`}
            onClick={() => setActiveTab("적립 내역")}
          >
            적립 내역
            {activeTab === "적립 내역" && (
              <div className="absolute bottom-[0] left-0 right-0 h-[2px] bg-neutral-5" />
            )}
          </button>
        </nav>

        {/* Tab Content */}
        <section className="flex flex-col gap-[12px]">
          {activeTab === "달성 목표" &&
            goalsData.map((goal, index) => (
              <div
                key={index}
                className="bg-common-white rounded-2xl p-[18px] flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-[50px] h-[50px] rounded-[16px] flex items-center justify-center ${goal.iconBg}`}
                  >
                    {goal.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sub3_sb_16 text-neutral-5">
                        {goal.title}
                      </div>
                      {goal.status && <Badge text={goal.status} />}
                    </div>
                    <div className="text-caption3_r_13 text-neutral-60 font-medium">
                      {goal.description}
                    </div>
                  </div>
                </div>
                <ArrowRightIcon className="w-[18px] h-[18px] text-neutral-70" />
              </div>
            ))}

          {activeTab === "적립 내역" &&
            (transactionData.length > 0 ? (
              transactionData.map((data, index) => (
                <div
                  key={index}
                  className="bg-common-white rounded-2xl p-[18px] flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="text-sub3_sb_16 text-neutral-5">
                        {data.title}
                      </div>
                      {data.status && <Badge text={data.status} />}
                    </div>
                    <div className="flex items-center text-caption3_r_13 text-neutral-50 font-medium">
                      {data.date} <BulletIcon className="w-4 h-4" />{" "}
                      {data.location}
                    </div>
                  </div>
                  <div
                    className={`text-sub2_m_18 font-semibold ${data.isPositive ? "text-primary" : "text-neutral-50"}`}
                  >
                    {data.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-neutral-50 text-sub3_sb_16">
                적립 내역이 없습니다.
              </div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default Reward;
