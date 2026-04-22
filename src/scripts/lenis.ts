import "lenis/dist/lenis.css";
import Lenis from "lenis";

const lenis = new Lenis({
    autoRaf: true,
});

// 导出实例供其他模块使用
export default lenis;