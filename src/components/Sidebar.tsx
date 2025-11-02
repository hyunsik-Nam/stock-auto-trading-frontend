import SquareBox from './ui/SquareBox';
const Sidebar = () => {
  const chat = [
    { id: '1', content: 'Hello', fnc: () => console.log('Hello') },
    { id: '2', content: 'How are you?', fnc: () => console.log('How are you?') },
    { id: '3', content: 'Goodbye', fnc: () => console.log('Goodbye') },
  ];
  return (
    <div className="space-y-2 p-4">
      <SquareBox id={'new_chat'} content={'새채팅'} fnc={() => console.log('새채팅')} imageUrl="/images/new_chat1.png" />
      <h1>채팅</h1>
      {chat.map(item => (
        <SquareBox key={item.id} id={item.id} content={item.content} fnc={item.fnc} />
      ))}
    </div>
  );
};
export default Sidebar;
