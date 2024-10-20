
export default function Main(props) {
  const { data } = props;
  return (
    <div className='bgImageContainer'>
        <img src={data?.hdurl} alt="Astronomy picture of the day" className='bgImage' />
    </div>
  )
}