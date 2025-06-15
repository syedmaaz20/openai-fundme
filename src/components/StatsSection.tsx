
import { Users, DollarSign, Book } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Book,
    label: "Students Helped",
    value: "1,235",
  },
  {
    id: 2,
    icon: DollarSign,
    label: "Funds Raised",
    value: "$248,900",
  },
  {
    id: 3,
    icon: Users,
    label: "Donors",
    value: "4,612",
  },
];

const StatsSection = () => (
  <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center bg-white border border-gray-100 rounded-2xl shadow-sm py-8 px-4 animate-fade-in">
    {stats.map((stat) => (
      <div key={stat.id} className="flex flex-col items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 mb-2 p-3">
          <stat.icon className="text-blue-600" size={32} strokeWidth={2.3} />
        </span>
        <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
        <span className="text-sm text-gray-600">{stat.label}</span>
      </div>
    ))}
  </section>
);

export default StatsSection;
