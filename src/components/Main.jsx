
export default function Main(props) {
  const { data } = props;
  return (
    <div className='bgImageContainer'>
        <img src={data.hdurl} alt="Mars landscape" className='bgImage' />
    </div>
  )
}