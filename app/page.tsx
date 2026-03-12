import { LayoutEngine } from '@/components/os-shell/LayoutEngine';
import { FloatingMenu } from '@/components/os-shell/FloatingMenu';

export default function Home() {
  return (
    <main className="w-full flex justify-center items-center min-h-screen relative">
      <FloatingMenu />
      <LayoutEngine />
    </main>
  );
}
