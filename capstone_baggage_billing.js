// Dữ liệu mẫu
const sampleTicket = {
  pnr: "VN508",
  passenger: "Nguyen Ngoc Khang",
  flight: "VN210",
  seat: "02A",
  class: "ECONOMY",
  membershipTier: "TITAN"
};

const sampleBaggageList = [
  { id: "BAG01", weight: 22, type: "STANDARD" },
  { id: "BAG02", weight: 12, type: "BULKY" },
  { id: "BAG03", weight: 5, type: "PET" }
];

function calculateBaggageSurcharge(ticket, baggageList) {
  let standardAllowance = ticket.class.toUpperCase() === "BUSINESS" ? 30 : 20;

  const eliteTiers = ["TITAN", "GOLD", "PLATINUM", "MILLION_MILER"];
  const isElite = eliteTiers.includes((ticket.membershipTier || "").toUpperCase());
  const bonusAllowance = isElite ? 10 : 0;
  const totalAllowance = standardAllowance + bonusAllowance;

  let totalWeight = 0;
  let specialFee = 0;
  let bulkyCount = 0;
  let petCount = 0;

  for (let i = 0; i < baggageList.length; i++) {
    const item = baggageList[i];
    totalWeight += item.weight;

    const itemType = (item.type || "").toUpperCase();
    if (itemType === "BULKY") {
      specialFee += 200000;
      bulkyCount++;
    } else if (itemType === "PET") {
      specialFee += 500000;
      petCount++;
    }
  }

  const excessWeight = Math.max(0, totalWeight - totalAllowance);
  let excessWeightFee = 0;

  if (excessWeight > 0) {
    if (excessWeight <= 5) {
      excessWeightFee = excessWeight * 60000;
    } else {
      excessWeightFee = (5 * 60000) + ((excessWeight - 5) * 80000);
    }
  }

  const totalSurcharge = excessWeightFee + specialFee;

  return {
    standardAllowance,
    bonusAllowance,
    totalAllowance,
    totalWeight,
    excessWeight,
    excessWeightFee,
    bulkyCount,
    petCount,
    specialFee,
    totalSurcharge
  };
}

function printBaggageReceipt(ticket, baggageList, billing) {
  const line = "=".repeat(48);
  const subLine = "-".repeat(48);

  const formatVND = num => num.toLocaleString("vi-VN") + " VND";
  const row = (label, val) => label.padEnd(28, " ") + ": " + String(val).padStart(17, " ");

  console.log("\n" + line);
  console.log("       HOA DON PHU CUOC HANH LY SAN BAY        ");
  console.log(line);
  console.log(row("Hanh khach", ticket.passenger.toUpperCase()));
  console.log(row("Ma dat cho (PNR)", ticket.pnr));
  console.log(row("Chuyen bay | Ghe", `${ticket.flight} | ${ticket.seat}`));
  console.log(row("Hang ve | Hoi vien", `${ticket.class} | ${ticket.membershipTier || "NONE"}`));
  console.log(subLine);
  console.log(row("Dinh muc co ban", `${billing.standardAllowance} kg`));
  console.log(row("Uu dai hoi vien", `+${billing.bonusAllowance} kg`));
  console.log(row("Tong han muc mien cuoc", `${billing.totalAllowance} kg`));
  console.log(row("Tong khoi luong thuc te", `${billing.totalWeight} kg`));
  console.log(row("Khoi luong vuot cuoc", `${billing.excessWeight} kg`));
  console.log(subLine);
  console.log(row("Cuoc qua can bac thang", formatVND(billing.excessWeightFee)));
  if (billing.bulkyCount > 0) {
    console.log(row(`Kien cong kenh (${billing.bulkyCount} kien)`, formatVND(billing.bulkyCount * 200000)));
  }
  if (billing.petCount > 0) {
    console.log(row(`Van chuyen thu cung (${billing.petCount} long)`, formatVND(billing.petCount * 500000)));
  }
  console.log(subLine);
  console.log(row("TONG TIEN THANH TOAN", formatVND(billing.totalSurcharge)));
  console.log(line + "\n");
}

const billingResult = calculateBaggageSurcharge(sampleTicket, sampleBaggageList);
printBaggageReceipt(sampleTicket, sampleBaggageList, billingResult);