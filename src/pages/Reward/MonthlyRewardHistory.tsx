import { useNavigate } from "react-router-dom";

import ArrowIcon from "../../assets/icons/arrow1_left.svg?react";
import FilterIcon from "../../assets/icons/filter_line.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import { useState } from "react";

const MonthlyRewardHistory = () => {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<"최신순" | "오래된 순">(
    "최신순",
  );

  const handleFilter = () => {};
  return (
    <div className="flex flex-col px-5">
      <header className="pt-6 pb-3 items-baseline shrink-0">
        <ArrowIcon className="w-6 h-6" onClick={() => navigate("/reward")} />
      </header>
      <main className="flex flex-col gap-5 pt-6 pb-15">
        <section className="flex flex-col gap-1">
          <div className="flex gap-1 text-head1_sb_24">
            이번 달<span className="text-primary">15,400원</span>모았어요
          </div>
          <div className="text-body4_r_14 text-cool-neutral-40">
            지난 달 대비 +24%
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-0.5 text-sub2_m_18">
              총<span className="text-primary text-sub1_sb_18">2</span>회
            </div>
            <div
              className="flex gap-1 py-1.5 pl-3 text-body2_m_14 text-cool-neutral-40 items-center cursor-pointer"
              onClick={handleFilter}
            >
              <FilterIcon className="w-4 h-4 text-cool-neutral-60" />
              {activeFilter}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <article className="flex gap-2.5 p-4 rounded-xl bg-[#EDF3FF] border-[1.5px] border-primary">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
            <article className="flex gap-2.5 p-4 rounded-xl bg-common-white shadow-card">
              <div className="w-11 h-11 bg-[#97A2B8] rounded-md"></div>
              <div className="flex flex-col flex-1 gap-1">
                <div className="flex justify-between items-center">
                  <div className="text-[#31353B] text-sub3_sb_16">
                    폐의약품 수거
                  </div>
                  <div className="text-primary text-sub4_sb_14">+ 3,000원</div>
                </div>
                <div className="flex gap-0.5 items-center text-[#62738F] text-caption3_r_13">
                  2026. 01. 01
                  <BulletIcon className="w-4 h-4" />
                  강남구 보건소
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MonthlyRewardHistory;
