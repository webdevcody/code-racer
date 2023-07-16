export type BannerSvg = {
  gearRightClass: string;
  gearLeftClass: string;
};

export default function BannerSvg(props: BannerSvg) {
  return (
    <div className="flex justify-center md:justify-end items-center w-full md:w-2/5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="550"
        height="550"
        viewBox="0 0 500 500"
        fill="none"
        className="max-lg:w-[350px] max-lg:h-[350px]"
      >
        <g id="hero-banner-image">
          <g id="background-overlay">
            <g id="Group">
              <path
                id="Vector"
                d="M471.009 238.296C466.073 280.097 446.987 328.699 408.868 351.026C351.273 384.768 356.094 436.664 243.675 459.225C226.148 462.744 209.514 464.225 193.829 463.933C185.397 463.777 177.236 463.097 169.364 461.938C97.916 451.502 49.834 401.838 32.194 341.888C8.97998 263.043 55.333 211.424 86.056 180.324C116.78 149.224 139.282 52.32 249.623 29.272C266.447 25.765 283.652 23.976 300.852 24.405C340.111 25.368 382.932 38.26 412.562 65.166C414.787 67.188 416.95 69.284 419.059 71.444C460.242 113.715 477.742 181.307 471.009 238.296Z"
                fill="#ECC94B"
              />
              <path
                id="Vector_2"
                opacity="0.7"
                d="M471.009 238.296C466.073 280.097 446.987 328.699 408.868 351.026C351.273 384.768 356.094 436.664 243.675 459.225C226.148 462.744 209.514 464.225 193.829 463.933C185.397 463.777 177.236 463.097 169.364 461.938C97.916 451.502 49.834 401.838 32.194 341.888C8.97998 263.043 55.333 211.424 86.056 180.324C116.78 149.224 139.282 52.32 249.623 29.272C266.447 25.765 283.652 23.976 300.852 24.405C340.111 25.368 382.932 38.26 412.562 65.166C414.787 67.188 416.95 69.284 419.059 71.444C460.242 113.715 477.742 181.307 471.009 238.296Z"
                fill="white"
              />
            </g>
          </g>
          <g id="table">
            <g id="Group_2">
              <path
                id="Vector_3"
                d="M463.785 282.927H478.968"
                stroke="#263238"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                id="Vector_4"
                d="M22.598 282.927H456.976"
                stroke="#263238"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
          <g id="Gears">
            <g id="right-spinning-gear">
              <path
                id="Vector_5"
                d="M440.464 165.835V158.007L432.967 156.935C432.271 153.1 430.779 149.543 428.661 146.446L433.22 140.365L427.685 134.83L421.626 139.373C418.54 137.236 414.994 135.722 411.165 135.003L410.089 127.477H402.261L401.189 134.974C397.354 135.67 393.797 137.162 390.7 139.28L384.619 134.721L379.084 140.256L383.627 146.315C381.49 149.401 379.976 152.947 379.257 156.777L371.731 157.853V165.681L379.228 166.753C379.924 170.588 381.416 174.145 383.534 177.242L378.975 183.323L384.51 188.858L390.569 184.315C393.655 186.452 397.202 187.966 401.03 188.685L402.106 196.21H409.934L411.006 188.713C414.841 188.017 418.398 186.525 421.495 184.408L427.576 188.967L433.111 183.432L428.568 177.373C430.705 174.287 432.219 170.74 432.938 166.911L440.464 165.835ZM406.097 180.822C395.615 180.822 387.119 172.325 387.119 161.844C387.119 151.363 395.616 142.866 406.097 142.866C416.578 142.866 425.075 151.363 425.075 161.844C425.075 172.325 416.578 180.822 406.097 180.822Z"
                stroke="#263238"
                strokeMiterlimit="10"
                className={props.gearLeftClass}
                style={{ transformBox: "fill-box" }}
              />
              <path
                id="Vector_6"
                d="M66.517 208.692V215.835L73.358 216.814C73.993 220.313 75.354 223.559 77.287 226.385L73.127 231.934L78.178 236.985L83.707 232.84C86.523 234.79 89.759 236.172 93.253 236.828L94.235 243.695H101.378L102.357 236.854C105.856 236.219 109.102 234.858 111.928 232.925L117.477 237.085L122.528 232.034L118.383 226.505C120.333 223.689 121.715 220.453 122.371 216.959L129.238 215.977V208.834L122.397 207.855C121.762 204.356 120.401 201.11 118.468 198.284L122.628 192.735L117.577 187.684L112.048 191.829C109.232 189.879 105.996 188.497 102.502 187.841L101.52 180.974H94.377L93.399 187.815C89.9 188.45 86.654 189.811 83.828 191.744L78.279 187.584L73.228 192.635L77.373 198.164C75.423 200.98 74.041 204.216 73.385 207.71L66.517 208.692ZM97.878 195.016C107.442 195.016 115.196 202.769 115.196 212.334C115.196 221.898 107.443 229.652 97.878 229.652C88.313 229.652 80.56 221.899 80.56 212.334C80.56 202.769 88.313 195.016 97.878 195.016Z"
                stroke="#263238"
                strokeMiterlimit="10"
                className={props.gearLeftClass}
                style={{ transformBox: "fill-box" }}
              />
              <path
                id="Vector_7"
                d="M216.696 90.2981V96.2821L222.427 97.1021C222.959 100.033 224.099 102.752 225.718 105.12L222.233 109.768L226.464 113.999L231.096 110.527C233.455 112.16 236.166 113.318 239.093 113.867L239.916 119.619H245.9L246.72 113.888C249.651 113.356 252.37 112.216 254.738 110.597L259.386 114.082L263.617 109.851L260.144 105.219C261.777 102.86 262.935 100.149 263.484 97.2221L269.236 96.3991V90.4151L263.505 89.5951C262.973 86.6641 261.833 83.9451 260.214 81.5771L263.699 76.9291L259.468 72.6981L254.836 76.1701C252.477 74.5371 249.766 73.3791 246.839 72.8301L246.016 67.0781H240.032L239.212 72.8091C236.281 73.3411 233.562 74.4811 231.194 76.1001L226.546 72.6151L222.315 76.8461L225.788 81.4781C224.155 83.8371 222.997 86.5481 222.448 89.4741L216.696 90.2981ZM242.966 78.8421C250.978 78.8421 257.473 85.3371 257.473 93.3491C257.473 101.361 250.978 107.856 242.966 107.856C234.954 107.856 228.459 101.361 228.459 93.3491C228.459 85.3371 234.954 78.8421 242.966 78.8421Z"
                stroke="#263238"
                strokeMiterlimit="10"
                className={props.gearLeftClass}
                style={{ transformBox: "fill-box" }}
              />
            </g>
            <g id="left-spinning-gear">
              <path
                id="Vector_8"
                d="M462.162 212.543V206.945L456.8 206.178C456.302 203.436 455.236 200.892 453.721 198.677L456.981 194.329L453.023 190.371L448.69 193.62C446.483 192.092 443.947 191.009 441.209 190.495L440.439 185.113H434.841L434.074 190.474C431.332 190.972 428.788 192.038 426.573 193.553L422.225 190.293L418.267 194.251L421.516 198.584C419.988 200.791 418.905 203.327 418.391 206.065L413.009 206.835V212.433L418.371 213.2C418.869 215.942 419.935 218.486 421.45 220.701L418.19 225.049L422.148 229.007L426.481 225.758C428.688 227.286 431.224 228.369 433.962 228.883L434.732 234.265H440.33L441.097 228.904C443.839 228.406 446.383 227.34 448.598 225.825L452.946 229.085L456.904 225.127L453.655 220.794C455.183 218.587 456.266 216.051 456.78 213.313L462.162 212.543ZM437.585 223.261C430.089 223.261 424.013 217.185 424.013 209.689C424.013 202.193 430.089 196.117 437.585 196.117C445.081 196.117 451.157 202.193 451.157 209.689C451.157 217.185 445.081 223.261 437.585 223.261Z"
                stroke="#263238"
                strokeMiterlimit="10"
                className={props.gearRightClass}
                style={{ transformBox: "fill-box" }}
              />
              <path
                id="Vector_9"
                d="M48.846 169.808V174.165L53.019 174.762C53.407 176.896 54.237 178.876 55.416 180.6L52.878 183.985L55.959 187.066L59.332 184.537C61.05 185.726 63.024 186.57 65.155 186.969L65.754 191.158H70.111L70.708 186.985C72.842 186.597 74.822 185.767 76.546 184.588L79.931 187.126L83.012 184.045L80.483 180.672C81.672 178.954 82.515 176.98 82.915 174.849L87.104 174.25V169.893L82.931 169.296C82.543 167.161 81.713 165.182 80.535 163.458L83.073 160.073L79.992 156.992L76.619 159.521C74.901 158.332 72.927 157.488 70.796 157.089L70.197 152.9H65.84L65.243 157.073C63.108 157.46 61.129 158.291 59.405 159.469L56.02 156.931L52.939 160.012L55.468 163.385C54.279 165.103 53.436 167.077 53.036 169.208L48.846 169.808ZM67.976 161.466C73.81 161.466 78.54 166.195 78.54 172.03C78.54 177.864 73.811 182.593 67.976 182.593C62.142 182.593 57.412 177.864 57.412 172.03C57.412 166.195 62.142 161.466 67.976 161.466Z"
                stroke="#263238"
                strokeMiterlimit="10"
                className={props.gearRightClass}
                style={{ transformBox: "fill-box" }}
              />
            </g>
          </g>
          <g id="Device">
            <g id="Group_3">
              <g id="XMLID_222_">
                <path
                  id="XMLID_4_"
                  d="M397.976 289.413H106.936V97.9671C106.936 93.5651 110.505 89.9961 114.907 89.9961H390.006C394.408 89.9961 397.977 93.5651 397.977 97.9671L397.976 289.413Z"
                  fill="#263238"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="XMLID_46_"
                  d="M441.632 377.569H63.279L106.935 289.413H397.976L441.632 377.569Z"
                  fill="white"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_10"
                  opacity="0.8"
                  d="M380.343 105.79H124.56V273.627H380.343V105.79Z"
                  fill="white"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="XMLID_44_"
                  opacity="0.72"
                  d="M380.347 105.786H124.564V273.623H380.347V105.786Z"
                  fill="#FFC727"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="XMLID_51_">
                  <path
                    id="XMLID_74_"
                    d="M240.315 317.318L240.82 306.576H225.442L224.423 317.318H240.315Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_75_"
                    d="M272.1 317.318L271.576 306.576H256.197L256.207 317.318H272.1Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_76_"
                    d="M354.871 328.804H371.313L367.453 317.318H351.561L354.871 328.804Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_77_"
                    d="M224.423 317.318L225.442 306.576H210.063L208.531 317.318H224.423Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_78_"
                    d="M192.639 317.318L194.686 306.576H179.307L176.746 317.318H192.639Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_80_"
                    d="M335.669 317.318L333.087 306.576H317.71L319.776 317.318H335.669Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_81_"
                    d="M351.561 317.318L348.465 306.576H333.087L335.669 317.318H351.561Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_82_"
                    d="M176.746 317.318L179.307 306.576H163.93L160.854 317.318H176.746Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_83_"
                    d="M287.992 317.318L286.953 306.576H271.576L272.1 317.318H287.992Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_84_"
                    d="M367.453 317.318L363.843 306.576H348.465L351.561 317.318H367.453Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_85_"
                    d="M319.776 317.318L317.71 306.576H302.332L303.884 317.318H319.776Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_86_"
                    d="M303.884 317.318L302.332 306.576H286.953L287.992 317.318H303.884Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_87_"
                    d="M256.207 317.318L256.197 306.576H240.82L240.315 317.318H256.207Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_94_"
                    d="M144.962 317.318H129.07L124.682 328.804H141.123L144.962 317.318Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_95_"
                    d="M148.552 306.576H133.174L129.07 317.318H144.962L148.552 306.576Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_96_"
                    d="M160.854 317.318L163.93 306.576H148.552L144.962 317.318H160.854Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_97_"
                    d="M119.979 341.113L114.927 354.336H132.591L137.01 341.113H119.979Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_98_"
                    d="M141.123 328.804H124.682L119.979 341.113H137.01L141.123 328.804Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_99_"
                    d="M137.01 341.113L132.591 354.336H150.255L154.041 341.113H137.01Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_100_"
                    d="M208.531 317.318L210.063 306.576H194.686L192.639 317.318H208.531Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_101_"
                    d="M206.892 328.804L208.531 317.318H192.639L190.45 328.804H206.892Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_102_"
                    d="M190.45 328.804L192.639 317.318H176.746L174.008 328.804H190.45Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_103_"
                    d="M223.334 328.804L224.423 317.318H208.531L206.892 328.804H223.334Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_104_"
                    d="M160.854 317.318H144.962L141.123 328.804H157.566L160.854 317.318Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_105_"
                    d="M358.417 341.113H375.449L371.313 328.804H354.871L358.417 341.113Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_106_"
                    d="M174.008 328.804L176.746 317.318H160.854L157.566 328.804H174.008Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_107_"
                    d="M141.123 328.804L137.01 341.113H154.041L157.566 328.804H141.123Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_108_"
                    d="M321.986 328.804L319.776 317.318H303.884L305.544 328.804H321.986Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_109_"
                    d="M305.544 328.804L303.884 317.318H287.992L289.102 328.804H305.544Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_110_"
                    d="M354.871 328.804L351.561 317.318H335.669L338.428 328.804H354.871Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_111_"
                    d="M256.218 328.804L256.207 317.318H240.315L239.776 328.804H256.218Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_112_"
                    d="M289.102 328.804L287.992 317.318H272.1L272.66 328.804H289.102Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_113_"
                    d="M272.66 328.804L272.1 317.318H256.207L256.218 328.804H272.66Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_114_"
                    d="M239.776 328.804L240.315 317.318H224.423L223.334 328.804H239.776Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_115_"
                    d="M289.102 328.804L290.292 341.113H307.323L305.544 328.804H289.102Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_116_"
                    d="M305.544 328.804L307.323 341.113H324.355L321.986 328.804H305.544Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_117_"
                    d="M157.566 328.804L154.041 341.113H171.073L174.008 328.804H157.566Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_118_"
                    d="M321.986 328.804L324.355 341.113H341.386L338.428 328.804H321.986Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_119_"
                    d="M256.218 328.804L256.229 341.113H273.261L272.66 328.804H256.218Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_120_"
                    d="M338.428 328.804L341.386 341.113H358.417L354.871 328.804H338.428Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_121_"
                    d="M272.66 328.804L273.261 341.113H290.292L289.102 328.804H272.66Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_122_"
                    d="M190.45 328.804L188.104 341.113H205.135L206.892 328.804H190.45Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_123_"
                    d="M174.008 328.804L171.073 341.113H188.104L190.45 328.804H174.008Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_124_"
                    d="M239.776 328.804L239.198 341.113H256.229L256.218 328.804H239.776Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_125_"
                    d="M223.334 328.804L222.167 341.113H239.198L239.776 328.804H223.334Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_126_"
                    d="M206.892 328.804L205.135 341.113H222.167L223.334 328.804H206.892Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_127_"
                    d="M338.428 328.804L335.669 317.318H319.776L321.986 328.804H338.428Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_132_"
                    d="M148.552 306.576L152.226 295.581H137.375L133.174 306.576H148.552Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_135_"
                    d="M133.174 306.576H118.979L114.4 317.318H129.07L133.174 306.576Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_136_"
                    d="M137.375 295.581H123.665L118.979 306.576H133.174L137.375 295.581Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_137_"
                    d="M129.07 317.318H114.4L109.504 328.804H124.682L129.07 317.318Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_138_"
                    d="M124.682 328.804H109.504L104.257 341.113H119.979L124.682 328.804Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_3_"
                    d="M119.979 341.113H104.257L98.621 354.336H114.927L119.979 341.113Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_2_"
                    d="M383.345 317.318L387.755 328.804H402.3L397.404 317.318H383.345Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_147_"
                    d="M392.48 341.113H407.546L402.3 328.804H387.755L392.48 341.113Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_148_"
                    d="M397.557 354.336H413.183L407.546 341.113H392.48L397.557 354.336Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_155_"
                    d="M271.576 306.576L271.039 295.581H256.187L256.197 306.576H271.576Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_156_"
                    d="M383.345 317.318H397.404L392.825 306.576H379.221L383.345 317.318Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_157_"
                    d="M375.449 341.113H392.48L387.755 328.804H371.313L375.449 341.113Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_158_"
                    d="M163.93 306.576L167.077 295.581H152.226L148.552 306.576H163.93Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_159_"
                    d="M363.843 306.576L367.453 317.318H383.345L379.221 306.576H363.843Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_160_"
                    d="M392.825 306.576L388.138 295.581H375L379.221 306.576H392.825Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_161_"
                    d="M379.221 306.576L375 295.581H360.149L363.843 306.576H379.221Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_162_"
                    d="M324.355 341.113L326.899 354.336H344.563L341.386 341.113H324.355Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_163_"
                    d="M379.892 354.336H397.557L392.48 341.113H375.449L379.892 354.336Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_164_"
                    d="M363.843 306.576L360.149 295.581H345.297L348.465 306.576H363.843Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_167_"
                    d="M358.417 341.113L362.228 354.336H379.892L375.449 341.113H358.417Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_168_"
                    d="M341.386 341.113L344.563 354.336H362.228L358.417 341.113H341.386Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_169_"
                    d="M371.313 328.804H387.755L383.345 317.318H367.453L371.313 328.804Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_170_"
                    d="M225.442 306.576L226.484 295.581H211.633L210.063 306.576H225.442Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_171_"
                    d="M348.465 306.576L345.297 295.581H330.446L333.087 306.576H348.465Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_172_"
                    d="M210.063 306.576L211.633 295.581H196.781L194.686 306.576H210.063Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_173_"
                    d="M256.197 306.576L256.187 295.581H241.336L240.82 306.576H256.197Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_174_"
                    d="M194.686 306.576L196.781 295.581H181.929L179.307 306.576H194.686Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_175_"
                    d="M179.307 306.576L181.929 295.581H167.077L163.93 306.576H179.307Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_176_"
                    d="M240.82 306.576L241.336 295.581H226.484L225.442 306.576H240.82Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_177_"
                    d="M333.087 306.576L330.446 295.581H315.594L317.71 306.576H333.087Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_178_"
                    d="M317.71 306.576L315.594 295.581H300.742L302.332 306.576H317.71Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_179_"
                    d="M286.953 306.576L285.891 295.581H271.039L271.576 306.576H286.953Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_53_"
                    d="M324.355 341.113H307.323H290.292H273.261H256.229H239.198H222.167H205.135H188.104H171.073H154.041L150.255 354.336H167.919H185.584H203.248H220.913H238.577H256.241H273.906H291.57H309.234H326.899L324.355 341.113Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="XMLID_181_"
                    d="M302.332 306.576L300.742 295.581H285.891L286.953 306.576H302.332Z"
                    fill="#263238"
                    stroke="white"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <path
                  id="XMLID_45_"
                  d="M441.804 377.569H63.279V382.94H441.804V377.569Z"
                  fill="#263238"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </g>
          <g id="Coding">
            <g id="Group_4">
              <g id="Group_5">
                <path
                  id="Vector_11"
                  d="M141.055 119.022H157.545"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_12"
                  d="M141.055 127.49H203.005"
                  stroke="white"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_13"
                  d="M236.877 127.49H298.827"
                  stroke="white"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_14"
                  d="M207.016 127.49H231.529"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_15"
                  d="M141.055 135.958H176.71"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_16"
                  d="M181.166 135.958H216.821"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_17"
                  d="M221.278 135.958H256.933"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_18"
                  d="M261.39 135.958H276.543"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_19"
                  d="M162.002 119.022H178.492"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="Group_6">
                  <path
                    id="Vector_20"
                    d="M260.053 119.022H276.543"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_21"
                    d="M238.214 119.022H254.704"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_22"
                    d="M182.949 119.022H231.083"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g id="Group_7">
                <path
                  id="Vector_23"
                  d="M141.055 170.721H157.545"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_24"
                  d="M141.055 179.189H203.005"
                  stroke="white"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_25"
                  d="M236.877 179.189H298.827"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_26"
                  d="M207.016 179.189H231.529"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_27"
                  d="M141.055 187.658H176.71"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_28"
                  d="M181.166 187.658H216.821"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_29"
                  d="M221.278 187.658H256.933"
                  stroke="white"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_30"
                  d="M261.39 187.658H276.543"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_31"
                  d="M162.002 170.721H178.492"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="Group_8">
                  <path
                    id="Vector_32"
                    d="M260.053 170.721H276.543"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_33"
                    d="M238.214 170.721H254.704"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_34"
                    d="M182.949 170.721H231.083"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g id="Group_9">
                <path
                  id="Vector_35"
                  d="M141.055 246.934H157.545"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_36"
                  d="M141.055 255.402H203.005"
                  stroke="white"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_37"
                  d="M236.877 255.402H298.827"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_38"
                  d="M207.016 255.402H231.529"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_39"
                  d="M141.055 263.87H176.71"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_40"
                  d="M181.166 263.87H216.821"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_41"
                  d="M221.278 263.87H256.933"
                  stroke="white"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_42"
                  d="M261.39 263.87H276.543"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  id="Vector_43"
                  d="M162.002 246.934H178.492"
                  stroke="#263238"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="Group_10">
                  <path
                    id="Vector_44"
                    d="M260.053 246.934H276.543"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_45"
                    d="M238.214 246.934H254.704"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_46"
                    d="M182.949 246.934H231.083"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g id="Group_11">
                <g id="Group_12">
                  <path
                    id="Vector_47"
                    d="M233.757 144.872H250.248"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_48"
                    d="M211.919 144.872H228.409"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_49"
                    d="M156.654 144.872H204.788"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="Group_13">
                  <path
                    id="Vector_50"
                    d="M233.757 160.025H250.248"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_51"
                    d="M211.919 160.025H228.409"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_52"
                    d="M156.654 160.025H204.788"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="Group_14">
                  <path
                    id="Vector_53"
                    d="M173.144 152.448H156.654"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_54"
                    d="M194.983 152.448H178.492"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_55"
                    d="M250.248 152.448H202.114"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g id="Group_15">
                <g id="Group_16">
                  <path
                    id="Vector_56"
                    d="M233.757 197.908H250.248"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_57"
                    d="M211.919 197.908H228.409"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_58"
                    d="M156.654 197.908H204.788"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="Group_17">
                  <path
                    id="Vector_59"
                    d="M233.757 213.062H250.248"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_60"
                    d="M211.919 213.062H228.409"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_61"
                    d="M156.654 213.062H204.788"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="Group_18">
                  <path
                    id="Vector_62"
                    d="M173.144 205.485H156.654"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_63"
                    d="M194.983 205.485H178.492"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_64"
                    d="M250.248 205.485H202.114"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g id="Group_19">
                <g id="Group_20">
                  <path
                    id="Vector_65"
                    d="M173.144 221.975H156.654"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_66"
                    d="M194.983 221.975H178.492"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_67"
                    d="M250.248 221.975H202.114"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="Group_21">
                  <path
                    id="Vector_68"
                    d="M173.144 237.129H156.654"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_69"
                    d="M194.983 237.129H178.492"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_70"
                    d="M250.248 237.129H202.114"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="Group_22">
                  <path
                    id="Vector_71"
                    d="M233.757 229.552H250.248"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_72"
                    d="M211.919 229.552H228.409"
                    stroke="#263238"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_73"
                    d="M156.654 229.552H204.788"
                    stroke="white"
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <g id="Group_23">
                <path
                  id="Vector_74"
                  d="M134.938 116.081H129.673V121.281H134.938V116.081Z"
                  fill="#263238"
                />
                <path
                  id="Vector_75"
                  d="M134.938 124.624H129.673V129.824H134.938V124.624Z"
                  fill="#263238"
                />
                <path
                  id="Vector_76"
                  d="M134.938 133.167H129.673V138.367H134.938V133.167Z"
                  fill="#263238"
                />
                <path
                  id="Vector_77"
                  d="M134.938 141.711H129.673V146.911H134.938V141.711Z"
                  fill="#263238"
                />
                <path
                  id="Vector_78"
                  d="M134.938 150.254H129.673V155.454H134.938V150.254Z"
                  fill="#263238"
                />
                <path
                  id="Vector_79"
                  d="M134.938 158.797H129.673V163.997H134.938V158.797Z"
                  fill="#263238"
                />
                <path
                  id="Vector_80"
                  d="M134.938 167.34H129.673V172.54H134.938V167.34Z"
                  fill="#263238"
                />
                <path
                  id="Vector_81"
                  d="M134.938 175.883H129.673V181.083H134.938V175.883Z"
                  fill="#263238"
                />
                <path
                  id="Vector_82"
                  d="M134.938 184.427H129.673V189.627H134.938V184.427Z"
                  fill="#263238"
                />
                <path
                  id="Vector_83"
                  d="M134.938 192.97H129.673V198.17H134.938V192.97Z"
                  fill="#263238"
                />
                <path
                  id="Vector_84"
                  d="M134.938 201.513H129.673V206.713H134.938V201.513Z"
                  fill="#263238"
                />
                <path
                  id="Vector_85"
                  d="M134.938 210.056H129.673V215.256H134.938V210.056Z"
                  fill="#263238"
                />
                <path
                  id="Vector_86"
                  d="M134.938 218.599H129.673V223.799H134.938V218.599Z"
                  fill="#263238"
                />
                <path
                  id="Vector_87"
                  d="M134.938 227.143H129.673V232.343H134.938V227.143Z"
                  fill="#263238"
                />
                <path
                  id="Vector_88"
                  d="M134.938 235.686H129.673V240.886H134.938V235.686Z"
                  fill="#263238"
                />
                <path
                  id="Vector_89"
                  d="M134.938 244.229H129.673V249.429H134.938V244.229Z"
                  fill="#263238"
                />
                <path
                  id="Vector_90"
                  d="M134.938 252.772H129.673V257.972H134.938V252.772Z"
                  fill="#263238"
                />
                <path
                  id="Vector_91"
                  d="M134.938 261.315H129.673V266.515H134.938V261.315Z"
                  fill="#263238"
                />
              </g>
            </g>
          </g>
          <g id="Speech_Bubble">
            <g id="Group_24">
              <path
                id="Vector_92"
                d="M380.038 22.6609C348.451 22.6609 322.845 48.2669 322.845 79.8539C322.845 96.1049 329.634 110.76 340.517 121.173L332.378 136.366L352.339 129.892C360.547 134.445 369.987 137.047 380.039 137.047C411.626 137.047 437.232 111.441 437.232 79.8539C437.231 48.2679 411.625 22.6609 380.038 22.6609Z"
                fill="#263238"
                stroke="#263238"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                id="Vector_93"
                d="M377.315 18.5759C345.728 18.5759 320.122 44.1819 320.122 75.7689C320.122 92.0199 326.911 106.676 337.793 117.088L329.654 132.281L349.615 125.807C357.823 130.36 367.263 132.962 377.315 132.962C408.902 132.962 434.508 107.356 434.508 75.7689C434.508 44.1819 408.902 18.5759 377.315 18.5759Z"
                fill="white"
                stroke="#263238"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
          <g id="tag">
            <g id="Group_25">
              <g id="Group_26">
                <path
                  id="Vector_105"
                  d="M358.164 99.339L336.187 83.817V75.594L358.164 59.918V68.217L342.411 79.667L358.164 91.117V99.339Z"
                  fill="#275FFF"
                  fillOpacity="0.5"
                />
                <path
                  id="Vector_106"
                  d="M364.848 102.106L381.6 39.8621H388.747L371.918 102.105L364.848 102.106Z"
                  fill="#275FFF"
                  fillOpacity="0.5"
                />
                <path
                  id="Vector_107"
                  d="M395.431 99.339V91.117L411.261 79.59L395.431 68.217V59.918L417.486 75.517V83.739L395.431 99.339Z"
                  fill="#265FFF"
                  fillOpacity="0.5"
                />
              </g>
              <g id="Group_27">
                <path
                  id="Vector_108"
                  d="M360.887 95.9349L338.91 80.4119V72.1899L360.887 56.5139V64.8129L345.134 76.2629L360.887 87.7129V95.9349Z"
                  fill="#263238"
                />
                <path
                  id="Vector_109"
                  d="M367.572 98.701L384.324 36.458H391.471L374.642 98.701H367.572Z"
                  fill="#263238"
                />
                <path
                  id="Vector_110"
                  d="M398.155 95.9349V87.7129L413.985 76.1859L398.155 64.8129V56.5139L420.21 72.1129V80.3349L398.155 95.9349Z"
                  fill="#263238"
                />
              </g>
            </g>
          </g>
          <g id="hands">
            <g id="Hand_2">
              <g id="Group_28">
                <path
                  id="Vector_111"
                  d="M333.834 383.53L368.464 412.118C368.464 412.118 370.507 417.565 375.273 423.693C380.039 429.821 435.87 452.97 435.87 452.97L445.402 455.693L341.229 377.393L333.834 383.53Z"
                  fill="#263238"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="Group_29">
                  <path
                    id="Vector_112"
                    d="M401.276 360.82C401.276 360.82 391.986 349.465 387.857 342.239C383.728 335.013 377.878 318.153 373.405 308.174C368.932 298.195 362.394 295.098 354.48 292.002C346.566 288.905 343.469 289.593 343.469 291.658C343.469 293.723 346.566 297.508 346.566 297.508L333.146 299.917C333.146 299.917 327.641 296.82 324.2 297.852C320.759 298.884 314.221 305.422 314.221 305.422C314.221 305.422 307.339 303.013 303.21 304.046C299.081 305.078 287.726 310.584 282.909 312.992C278.092 315.401 272.93 315.745 273.275 317.809C273.619 319.874 278.436 323.314 282.909 322.626C287.382 321.938 294.952 319.185 299.77 319.185C304.588 319.185 306.996 320.217 309.404 321.938C311.813 323.659 321.791 337.766 323.168 339.487C324.544 341.207 325.921 348.089 325.921 348.089C325.921 348.089 319.854 345.496 316.069 342.055C312.284 338.614 306.869 330.544 300.675 329.856C294.481 329.168 287.726 334.669 291.167 337.422C294.608 340.175 298.049 341.895 300.457 344.992C302.866 348.089 306.651 357.379 313.188 367.358C319.726 377.337 333.833 383.53 333.833 383.53L363.081 395.573C363.081 395.573 370.651 377.68 384.759 372.863C398.867 368.046 402.996 365.981 402.996 365.981L401.276 360.82Z"
                    fill="white"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_113"
                    d="M273.274 317.808C273.274 317.808 276.629 316.954 277.595 316.632C278.561 316.31 279.689 315.344 279.689 315.344"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_114"
                    d="M314.221 305.421C314.221 305.421 330.071 314.286 334.544 316.695C336.383 317.685 340.74 319.723 342.084 324.235C343.672 329.567 346.882 332.46 346.882 332.46"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_115"
                    d="M333.146 299.915C333.146 299.915 348.63 311.958 349.662 312.302C350.694 312.646 354.479 312.99 356.2 316.087C357.92 319.184 359.641 322.625 359.641 322.625"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_116"
                    d="M346.565 297.507C346.565 297.507 352.07 296.475 354.135 300.604C356.2 304.733 365.146 314.712 365.146 314.712"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_117"
                    d="M297.36 341.895C297.36 341.895 301.489 339.831 299.424 336.734C297.36 333.637 293.23 333.637 293.23 333.637"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_118"
                    d="M400.587 356.346C400.587 356.346 382.006 361.163 370.307 374.239C358.608 387.315 358.608 398.325 359.64 400.046C360.672 401.767 383.038 413.81 383.038 413.81C383.038 413.81 396.802 387.315 406.436 380.777C416.07 374.239 422.952 372.519 422.952 372.519C422.952 372.519 405.747 361.508 405.059 360.132C404.372 358.755 402.996 355.314 400.587 356.346Z"
                    fill="#FFC727"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="Vector_119">
                    <path
                      d="M452.889 459.918C452.889 459.918 433.964 450.283 429.491 447.875C425.018 445.466 394.394 428.95 394.394 428.95C394.394 428.95 390.609 427.918 388.544 426.885C386.48 425.853 383.383 426.197 382.006 418.971C380.63 411.745 384.071 397.293 399.555 382.841C415.039 368.389 424.674 369.077 424.674 369.077C424.674 369.077 431.212 368.389 432.932 369.765C434.652 371.141 434.997 375.271 436.717 375.959C438.437 376.647 486.049 390.918 486.049 390.918"
                      fill="#FFC727"
                    />
                    <path
                      d="M452.889 459.918C452.889 459.918 433.964 450.283 429.491 447.875C425.018 445.466 394.394 428.95 394.394 428.95C394.394 428.95 390.609 427.918 388.544 426.885C386.48 425.853 383.383 426.197 382.006 418.971C380.63 411.745 384.071 397.293 399.555 382.841C415.039 368.389 424.674 369.077 424.674 369.077C424.674 369.077 431.212 368.389 432.932 369.765C434.652 371.141 434.997 375.271 436.717 375.959C438.437 376.647 486.049 390.918 486.049 390.918"
                      stroke="#263238"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <path
                    id="Vector_120"
                    d="M398.867 406.928C398.867 406.928 396.802 417.251 401.62 425.853"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_121"
                    d="M403.684 420.347C403.684 420.347 401.619 421.035 407.125 429.982"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>
            <g id="Hand_1">
              <g id="Group_30">
                <path
                  id="Vector_122"
                  d="M191.647 353.163C191.647 353.163 168.969 380.117 162.161 385.564C155.352 391.011 149.225 394.415 149.225 394.415L124.714 418.926C124.714 418.926 125.395 422.33 118.586 426.416C111.777 430.501 98.16 435.267 94.756 436.629C91.352 437.991 53.904 455.012 53.904 455.012L191.647 353.163Z"
                  fill="#263238"
                  stroke="#263238"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="Group_31">
                  <path
                    id="Vector_123"
                    d="M224.553 311.912C222.169 312.627 213.585 312.15 213.585 312.15C213.585 312.15 208.339 308.097 205.716 305.712C203.093 303.328 196.417 289.259 193.079 288.544C189.741 287.829 175.673 295.936 175.673 295.936C175.673 295.936 164.228 290.929 161.366 291.406C158.504 291.883 149.205 300.228 149.205 300.228C149.205 300.228 136.329 298.32 133.945 302.136C131.561 305.951 127.745 318.112 123.93 325.742C120.115 333.372 106.285 353.64 106.285 353.64L104.377 356.263C104.377 356.263 107.238 357.217 116.061 361.747C124.883 366.277 138.952 387.737 138.952 387.737C138.952 387.737 158.504 378.676 169.473 373.669C180.441 368.662 189.264 357.693 191.648 353.163C194.032 348.633 198.086 344.34 203.093 340.287C208.1 336.234 217.4 334.564 219.546 331.703C221.692 328.842 218.115 324.55 218.115 324.55C218.115 324.55 220.738 323.119 221.93 322.166C223.122 321.212 227.891 318.589 228.368 315.728C228.845 312.867 226.937 311.196 224.553 311.912ZM187.832 334.802L192.363 320.972C194.271 322.403 202.616 325.503 202.616 325.503C197.132 326.934 187.832 334.802 187.832 334.802Z"
                    fill="white"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_124"
                    d="M140.144 315.965C140.144 315.965 139.429 311.912 139.906 310.481C140.383 309.05 149.205 300.228 149.205 300.228"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_125"
                    d="M147.774 320.734L149.681 314.535L175.672 295.936"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_126"
                    d="M160.65 325.265C160.65 325.265 161.604 319.304 162.796 318.35C163.988 317.396 173.049 315.25 173.049 315.25C173.049 315.25 186.879 303.328 189.263 303.328C191.647 303.328 209.054 312.627 213.584 312.15"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_127"
                    d="M221.214 313.104C221.214 313.104 218.109 313.114 219.778 315.021C221.447 316.929 225.024 315.975 226.693 315.498"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_128"
                    d="M202.616 325.503C202.616 325.503 211.2 320.496 218.115 324.549"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_129"
                    d="M215.969 325.98L211.2 327.649C211.2 327.649 213.108 331.464 213.346 332.895C213.584 334.326 213.584 334.326 213.584 334.326"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_130"
                    d="M187.832 334.802L183.54 344.34"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_131"
                    d="M74.572 371.761C74.572 371.761 89.594 361.985 95.078 357.931C100.562 353.877 103.424 354.593 106.285 353.639C109.146 352.685 123.453 356.977 132.991 368.899C142.529 380.821 141.575 389.644 140.383 392.028C139.191 394.412 109.147 412.534 109.147 412.534C109.147 412.534 104.855 395.366 92.218 385.113C79.579 374.861 74.572 371.761 74.572 371.761Z"
                    fill="#FFC727"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="Vector_132">
                    <path
                      d="M14.484 400.288C14.484 400.288 42.312 383.283 46.95 380.491C51.588 377.699 56.958 373.892 56.958 373.892C56.958 373.892 58.423 366.532 65.502 366.278C72.581 366.024 79.416 368.816 88.692 373.892C97.968 378.968 109.441 397.496 110.661 404.856C111.881 412.216 114.322 414.501 112.37 419.323C110.417 424.145 103.094 424.399 101.629 424.399C100.164 424.399 96.747 427.445 96.747 427.445L44.509 461.455"
                      fill="#FFC727"
                    />
                    <path
                      d="M14.484 400.288C14.484 400.288 42.312 383.283 46.95 380.491C51.588 377.699 56.958 373.892 56.958 373.892C56.958 373.892 58.423 366.532 65.502 366.278C72.581 366.024 79.416 368.816 88.692 373.892C97.968 378.968 109.441 397.496 110.661 404.856C111.881 412.216 114.322 414.501 112.37 419.323C110.417 424.145 103.094 424.399 101.629 424.399C100.164 424.399 96.747 427.445 96.747 427.445L44.509 461.455"
                      stroke="#263238"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <path
                    id="Vector_133"
                    d="M100.83 411.477C100.83 411.477 103.014 413.099 98.646 419.911"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    id="Vector_134"
                    d="M97.711 414.72C97.711 414.72 97.399 421.856 90.848 428.344"
                    stroke="#263238"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_3_4"
            x="347.785"
            y="115.785"
            width="88.71"
            height="8.43018"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_3_4"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_3_4"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
