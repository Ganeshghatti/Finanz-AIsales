import LinearProgress from "@mui/joy/LinearProgress";

function Spinnerf() {
  const transparentBgStyle = {
    background: "rgba(255, 255, 255, 0.5)",
    zIndex: 1000
  };

  return (
    <section
      className="items-center justify-center w-screen h-screen fixed flex top-0 left-0"
      style={transparentBgStyle}
    >
      <div className="w-2/5 md:w-3/4">
        <LinearProgress
          color="primary"
          determinate={false}
          size="md"
          variant="soft"
        />
      </div>
    </section>
  );
}

export default Spinnerf;
