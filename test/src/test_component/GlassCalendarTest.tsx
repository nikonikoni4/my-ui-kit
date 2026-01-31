
import { GlassCalendar } from '../../../ui-kit/calendar';

export default function GlassCalendarTest() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-8 bg-[#e0e7ff]">
            <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                <div className="w-96 h-96 bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-[80px] opacity-40 translate-x-10 translate-y-10"></div>
                <div className="absolute w-80 h-80 bg-gradient-to-bl from-blue-300 to-cyan-300 rounded-full blur-[100px] opacity-40 -translate-x-20 -translate-y-20"></div>
            </div>

            <div className="z-10 w-full max-w-[400px]">
                <GlassCalendar
                    onRangeSelect={(range) => console.log('Range Selected:', range)}
                />

                <div className="mt-8 flex flex-col items-center gap-2 opacity-50 mix-blend-multiply">
                    <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-indigo-900">
                        Dynamic Header Interface
                    </p>
                </div>
            </div>
        </div>
    );
}
