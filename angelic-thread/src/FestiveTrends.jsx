
import "./FestiveTrends.css";

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // Replace with boutique WhatsApp number

function FestiveTrends() {
  const enquire = (item) => {
    const message = `Hi Rucha! I am interested in ${item}. Please share the designs and prices.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="festive-section" id="festive-trends">
      <div className="festive-container">
        <div className="festive-heading">
          <span className="festive-eyebrow">
            ✨ THE FESTIVE EDIT ✨
          </span>

          <h2>
            Festive <span>Trends</span>
          </h2>

          <p>
            From traditional Garba looks to modern festive fashion,
            find your perfect style with Angelic Thread Boutique by Rucha.
          </p>
        </div>

        <div className="garba-feature">
          <div className="garba-image">
            <img
              src="./Hero11.png"
              alt="Festive Indian ethnic fashion"
              loading="lazy"
            />
          </div>

          <div className="garba-content">
            <span className="festive-eyebrow">OLD TO NEW</span>
            <h3>Dont' Die & Tie... Recreat & Shine</h3>
            <p>
              Give your traditional outfits a fresh new look with
              stylish blouse designs, creative styling and festive
              finishing touches.
            </p>

            <button
              className="festive-button"
              onClick={() => enquire("Old to New Garba Styling")}
            >
              Enquire Us <span>↗</span>
            </button>
          </div>
        </div>

        

   
      </div>
    </section>
  );
}

export default FestiveTrends;
