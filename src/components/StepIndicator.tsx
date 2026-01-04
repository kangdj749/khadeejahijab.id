"use client";

type Step = {
  label: string;
  active: boolean;
  completed: boolean;
};

export default function StepIndicator({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
              ${step.active ? "bg-green-600 text-white" : step.completed ? "bg-green-300 text-white" : "bg-gray-300 text-gray-600"}
            `}
          >
            {i + 1}
          </div>
          {/* Label */}
          <span
            className={`text-sm font-medium ${
              step.active ? "text-green-600" : "text-gray-500"
            }`}
          >
            {step.label}
          </span>
          {/* Garis antar step */}
          {i < steps.length - 1 && (
            <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
}
