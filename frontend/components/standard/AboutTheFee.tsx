export default function AboutTheFee() {
  return (
    <div>
      <h3 className="text-[18px] md:text-[20px] font-medium text-navy-900">
        About the Fee
      </h3>

      <div className="mt-5 space-y-5 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          RunPayway&#8482; executes a defined structural measurement under Model
          Version RP-1.0.
        </p>

        <p>The one-time $79 fee supports:</p>

        <ul className="space-y-3 pl-1">
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Deterministic measurement execution</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Version-controlled governance</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Secure report issuance</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">&bull;</span>
            <span>Ongoing documentation of the Standard</span>
          </li>
        </ul>

        <p>
          There are no recurring charges. No tiered access. No upsell layers.
        </p>

        <p>
          The Payway Rating&#8482; remains referenced long after issuance.
        </p>
      </div>
    </div>
  );
}
