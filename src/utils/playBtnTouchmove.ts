import { ref } from 'vue';

export function playBtnTouchmove(ele: any) {
    const differenceX = ref(0);
    let startX: number,
        moveX,
        currentLeft = 0;
    // maxMove = control_bar.value!.offsetWidth;

    const control_btn_touchstart = (e: any) => {
        startX = e.targetTouches[0].clientX;
    };
    const control_btn_touchmove = (e: any) => {
        moveX = e.targetTouches[0].clientX;
        differenceX.value = moveX - startX;
        const lastPosition = differenceX.value + currentLeft;

        if (lastPosition < 0) {
            differenceX.value = 0;
        }
        // else if (lastPosition > maxMove) {
        //     differenceX.value = maxMove;
        // }
    };
    const control_btn_touchend = () => {
        currentLeft = differenceX.value;
        console.log(currentLeft);
    };

    return [
        differenceX,
        control_btn_touchstart,
        control_btn_touchend,
        control_btn_touchmove,
    ];
}
