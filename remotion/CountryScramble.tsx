import { Composition } from "remotion"

const CountryScramble = () => {
  return (
    <Composition
      id="CountryScramble"
      component={VideoComponent}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    ></Composition>
  );
}

export default CountryScramble
