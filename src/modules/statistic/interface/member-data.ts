import { Timestamp } from "firebase/firestore";

interface MemberData {
  id: string;
  name: string;
  avatar: string;
  toDo: number;
  doing: number;
  reviewing: number;
  done: number;
  joined_at: Timestamp | Date | string;
  room_index?: number;
}

export default MemberData;
