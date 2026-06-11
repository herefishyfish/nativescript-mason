import { useRoute } from 'solid-navigation';
export default function Home() {
  const route = useRoute();
  return (
    <>
      <actionbar title={route.name} />
      <div
        style={{
          backgroundColor: 'lightblue',
          padding: 16,
        }}
      >
        First
        <p
          style={{
            color: 'red',
            fontSize: 24,
          }}
        >
          Hello World
          <br />
          <span style={{ fontWeight: 'bold', color: 'green' }}>Cool</span>
          <br />
          <img src="https://picsum.photos/seed/picsum/200/300"/>
          <br/>
          Text after span
          <br />
          Line after br
        </p>
        Between blocks
        <br />
        After block-level br
      </div>
    </>
  );
}
