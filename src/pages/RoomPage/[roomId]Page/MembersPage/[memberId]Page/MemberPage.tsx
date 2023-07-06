import React, { useEffect } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../../../lib/provider/UserProvider";
import { useRooms } from "../../../../../lib/provider/RoomsProvider";
import { useStatistic } from "../../../../../lib/provider/StatisticProvider";
import LeftSideBar from "../../../../../modules/room/components/LeftSideBar/LeftSideBar";
import useAppSnackbar from "../../../../../lib/hook/useAppSnackBar";
import BarChart from "../../../../../lib/components/BarChart/BarChart";

const MemberPage = () => {
  const { roomId, memberId } = useParams();
  const { user } = useUser();
  const { currentRoom, getCurrentRoom, loadingCurrentRoom } = useRooms();
  const { member, getMember, loadingMember } = useStatistic();

  const { showSnackbarError } = useAppSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentRoom(roomId || "");
  }, [roomId]);

  useEffect(() => {
    if (currentRoom.manager_id && user) {
      if (user.id !== currentRoom.manager_id && user.id !== memberId) {
        showSnackbarError("Bạn không có quyền xem thông tin này");
        navigate(`/room`);
        return;
      }
      getMember({ room_id: roomId || "", member_id: memberId || "" });
    }
  }, [roomId, memberId, currentRoom, user]);

  return (
    <LeftSideBar>
      {loadingCurrentRoom || loadingMember ? (
        <Box
          style={{ marginTop: 16, display: "flex", justifyContent: "center" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          style={{
            height: 400,
            marginTop: 24,
            position: "relative",
          }}
        >
          <Typography style={{ marginLeft: 24, fontWeight: 600 }}>
            {member?.name}
          </Typography>
          <BarChart
            style={{
              height: 400,
              width: "100%",
              position: "absolute",
              bottom: 0,
            }}
            data={[
              { value: member.toDo, title: "Chưa làm" },
              { value: member.doing, title: "Đang làm" },
              { value: member.reviewing, title: "Chờ duyệt" },
              { value: member.done, title: "Hoàn thành" },
            ]}
          />
        </Box>
      )}
    </LeftSideBar>
  );
};

export default MemberPage;
