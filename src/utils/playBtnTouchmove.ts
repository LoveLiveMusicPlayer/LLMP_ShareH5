import {Ref, ref} from 'vue';

export function playBtnTouchmove(ele: Ref<HTMLElement>) {
    const differenceX = ref(0);
    let startX: number,
        moveX,
        currentLeft = 0;
    // maxMove = control_bar.value!.offsetWidth;

    ele.value.addEventListener('touchstart', (e: any) => {
        startX = e.targetTouches[0].clientX;
    });
    ele.value.addEventListener('touchmove', (e: any) => {
        moveX = e.targetTouches[0].clientX;
        differenceX.value = moveX - startX;
        const lastPosition = differenceX.value + currentLeft;

        if (lastPosition < 0) {
            differenceX.value = 0;
        }
        // else if (lastPosition > maxMove) {
        //     differenceX.value = maxMove;
        // }
    });

    ele.value.addEventListener('touchend', (e: any) => {
        currentLeft = differenceX.value;
        console.log(currentLeft);
    });

    return differenceX;
}
