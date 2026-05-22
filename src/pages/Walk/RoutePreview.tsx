import { useEffect, useState } from "react";
import { motion, useDragControls, type PanInfo } from "framer-motion";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import CloseIcon from "../../assets/icons/delete_line.svg?react";
import BulletIcon from "../../assets/icons/bullet.svg?react";
import LocationIcon from "../../assets/icons/location_fill.svg?react";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../api/axios";
import ErrorModal from "../../components/ErrorModal";

const activityMap: Record<string, string> = {
  MODERATE: "적당한",
  ACTIVE: "활발한",
  MAXIMUM: "최대의",
};

const RoutePreview = () => {
  const { binId } = useParams();
  const navigate = useNavigate();

  const { state } = useLocation(); // 앞 페이지에서 넘긴 데이터 받기

  const {
    setSheetState,
    sheetState,
    setRoutePath,
    setRoutePolyline,
    myLocation,
    setSelectedBinId,
  } = useOutletContext<any>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [windowHeight] = useState(window.innerHeight);

  // AI 경로 결과 저장할 상태
  const [routeData, setRouteData] = useState<any>(null);

  // 프리뷰 화면이 열리면 목적지(binId)를 선택된 상태로 지정
  useEffect(() => {
    if (binId) {
      setSelectedBinId(Number(binId));
    }
  }, [binId, setSelectedBinId]);

  // 이전 페이지에서 넘어온 데이터를 세팅
  useEffect(() => {
    if (state && state.routeData) {
      setRouteData(state.routeData);

      // 백엔드에서 받은 암호화된 경로 문자열(Polyline)을 지도 컴포넌트로 전달
      if (state.routeData.routePolyline) {
        setRoutePolyline(state.routeData.routePolyline);
      }
    }
  }, [state, setRoutePolyline]);

  const controls = useDragControls();

  // 인증하기 버튼 클릭 시 실행될 함수
  const handleAuthenticate = async () => {
    try {
      let finalReward = 0; // 얻은 리워드

      if (state.isMission) {
        // 미션에서 넘어온 경우
        await api.post(`/user-daily-missions/${state.missionId}/complete`, {
          earnedReward: state.earnedReward || 3000,
          currentLatitude: myLocation?.lat,
          currentLongitude: myLocation?.lng,
        });
        finalReward = state.earnedReward || 3000;
      } else {
        // 일반 수거함에서 넘어온 경우
        await api.post("/events", {
          userId: routeData?.userId || 1, // 백엔드 데이터 활용
          eventType: "MEDICINE_COLLECTION",
          title: "폐의약품 수거", // 필요시 state.name으로 대체
          rewardAmount: 100,
          eventDateTime: new Date().toISOString(),
          collectionLocationId: state?.binId || routeData?.destinationId,
          routeId: routeData?.id,
          currentLatitude: myLocation?.lat,
          currentLongitude: myLocation?.lng,
        });
        finalReward = 100; // 임시
      }

      // 완료 후 성공 화면으로 이동
      navigate("/complete", {
        replace: true, // 뒤로가기 했을 때 이 프리뷰 페이지로 다시 못 오게 막음
        state: {
          reward: finalReward,
          distance: routeData?.totalDistanceMeters || 0,
        },
      });
    } catch (error: any) {
      console.error("인증 처리 실패:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const formattedMsg = error.response.data.message.replace(".", ".\n");
        setErrorMessage(formattedMsg);
      } else {
        setErrorMessage("서버와 통신 중 문제가 발생했습니다.");
      }
      setIsErrorModalOpen(true);
    }
  };

  // 모달 제어 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const confirmModal = () => {
    navigate(`/walk/${binId}`);
  };

  // 프리뷰 전용 위치 상수
  const TOP_Y = 110;
  const MIDDLE_Y = windowHeight * 0.52;
  const BOTTOM_Y = windowHeight - 140;

  const getTargetY = () => {
    if (sheetState === "expanded") return TOP_Y;
    if (sheetState === "half") return MIDDLE_Y;
    return BOTTOM_Y;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.y;
    if (offset < -20) {
      if (sheetState === "collapsed") setSheetState("half");
      else if (sheetState === "half") setSheetState("expanded");
    } else if (offset > 20) {
      if (sheetState === "expanded") setSheetState("half");
      else if (sheetState === "half") setSheetState("collapsed");
    }
  };

  return (
    <>
      <div className="relative h-dvh w-full pointer-events-none">
        {/* 상단 목적지 플로팅 바  */}
        <div
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="fixed w-full max-w-md left-1/2 -translate-x-1/2 top-10 inset-x-0 px-5 z-50 pointer-events-auto"
        >
          <div className="bg-white rounded-full pl-5 pr-4 py-3 flex items-center justify-between shadow-card">
            <div className="flex gap-3 items-center">
              <span className="text-primary text-sub3_sb_16">목적지</span>
              <span className="text-body1_m_16">공릉1동 주민센터</span>
            </div>
            <button onClick={() => setIsModalOpen(!isModalOpen)}>
              <CloseIcon className="w-6 h-6 text-[#6C727C]" />
            </button>
          </div>
        </div>

        {/* 바텀시트 */}
        <motion.div
          animate={{ y: getTargetY() }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          // 바텀시트 높이를 (화면 전체 - 상단 여백)으로 강제 설정
          style={{ height: windowHeight - TOP_Y }}
          // style 높이를 따름
          className="fixed inset-x-0 top-0 bg-white w-full max-w-md mx-auto z-40 rounded-t-3xl shadow-xl flex flex-col pointer-events-auto overflow-hidden"
          drag="y"
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ top: TOP_Y, bottom: BOTTOM_Y }}
          onDragEnd={handleDragEnd}
        >
          {/* 드래그 핸들 */}
          <div
            onPointerDown={(e) => controls.start(e)}
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          >
            <div className="w-15 h-1 bg-[#C3C7CE] rounded-full" />
          </div>

          {/* 내부 레이아웃 */}
          <div className="flex flex-col h-full px-5 overflow-hidden">
            {/* 헤더 */}
            <div className="pb-5 flex-none">
              <div className="flex flex-col gap-2">
                <h2 className="text-title1_sb_20 mb-2">
                  지구를 지키는
                  <br />
                  운동을 시작해볼까요?
                </h2>
                <div className="flex gap-0.5 items-center">
                  <span className="text-primary text-caption1_m_13">
                    총 {routeData?.totalDistanceMeters}m{" "}
                  </span>
                  <BulletIcon className="w-4 h-4 text-[#7A8396]" />
                  <span className="text-[#40444B] text-caption3_r_13">
                    {activityMap[routeData?.activityLevel]} 활동량
                  </span>
                </div>
              </div>
            </div>

            {/* 휴식 포인트 */}
            <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar py-2 pb-20">
              {/* map() 함수를 이용해서 배열 길이만큼 반복해서 그림 */}
              {routeData?.restPoints?.map((point: any, index: number) => {
                const isLast = index === routeData.restPoints.length - 1; // 마지막 목적지인지 확인
                return (
                  <div
                    key={point.id}
                    className="grid grid-cols-[auto_1fr] gap-x-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-[#97A2B8] bg-[#F3F7FF] z-10 shrink-0" />
                      {/* 마지막 줄이면 점선을 안 그림 */}
                      {!isLast && (
                        <div className="w-0.5 h-full border-l border-dashed border-[#97A2B8]" />
                      )}
                    </div>
                    <div className="pb-8 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 text-[#6C727C] text-caption1_m_13">
                        <span>
                          <LocationIcon className="w-4 h-4 text-primary" />
                        </span>
                        {point.name}
                      </div>
                      <p className="text-body1_m_16 text-[#202123] ">
                        {point.instruction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
        {/* 인증하기 버튼 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 pb-10 pt-7 z-50 pointer-events-auto bg-linear-to-t from-white from-70% to-transparent">
          <button
            onClick={handleAuthenticate}
            className="w-full py-4 bg-primary rounded-xl text-white text-sub3_sb_16 active:scale-99 transition-transform"
          >
            인증하기
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmModal
          title="목적지를 재설정 하시겠습니까?"
          detail="목적지를 재설정하여 AI 경로 추천을 받을 수 있어요."
          onClose={closeModal}
          onConfirm={confirmModal}
        />
      )}
      {isErrorModalOpen && (
        <ErrorModal
          title="인증에 실패했습니다"
          detail={errorMessage}
          onClose={closeErrorModal}
        />
      )}
    </>
  );
};

export default RoutePreview;
