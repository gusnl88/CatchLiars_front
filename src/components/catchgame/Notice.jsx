export default function Notice({ chat }) {
    // chat ={
    //     type: "notice", // me, other, notice
    //     content: "~~~님이 입장하셨습니다.",
    //   },
    return <div className="notice">{chat.content}</div>;
}
