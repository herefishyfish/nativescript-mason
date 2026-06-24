import { Application, FlexboxLayout, GridLayout, ScrollView, StackLayout } from '@nativescript/core';
import { ViewBase } from '@triniwiz/nativescript-masonkit/common';
import { Div } from '@triniwiz/nativescript-masonkit/web';
/*
if (__ANDROID__) {
  Application.android.on(Application.AndroidApplication.activityCreatedEvent, (args) => {
    setTimeout(() => {
      //   run();
    }, 4000);
    // try {
    //   const nativeView = org.nativescript.mason.masonkit.Mason.getShared().createView(args.activity);
    //   const view = {
    //     nativeView,
    //     android: nativeView,
    //     _hasNativeView: true,
    //     _isMasonView: true,
    //   };
    //   const a = Style.fromView(view as never, nativeView, false);
    //   a.display = 'grid';
    //   a.gridAutoRows = '150px';
    //   a.gridGap = '10px';
    //   a.padding = '10px';

    //   // console.log(a.style.gridAutoRows);
    //   console.log(a);
    // } catch (error) {
    //   console.log('Error:', error);
    // }
  });
} else {
  // run();
}

//@ts-ignore
Application.run({ moduleName: 'app-root' });

*/

// Perf

//@ts-ignore
global.setImmediate = setTimeout;
//@ts-ignore
global.clearImmediate = clearTimeout;
//@ts-ignore
global.performance = {
  now() {
    if (global.android) {
      return java.lang.System.nanoTime() / 1000000;
    } else {
      return CACurrentMediaTime() * 1000;
    }
  },
};
global.process = {
  //@ts-ignore
  versions: {
    node: '10.0',
  },
};

function benchmark(root: any, Container: any, containerProps: any, Child: any, childProps: any) {
  return new Promise((resolve, reject) => {
    const MARKER = `Rendering 1000 ${Child.name} in ${Container.name} took`;
    const container = new Container();
    root.addChild(container);
    //@ts-ignore
    for (const prop in containerProps) {
      container[prop] = containerProps[prop];
    }
    setTimeout(() => {
      console.time(MARKER);
      for (let i = 0; i < 1000; i++) {
        const view = new Child();
        for (const prop in childProps) {
          view[prop] = childProps[prop];
        }
        container.addChild(view);
      }
      console.timeEnd(MARKER);
      resolve(true);
    }, 1000);
  });
}

function benchmarkProp(root: any, Container: any, containerProps: any, Child: any, childProps: any, benchmarkProp: { [name: string]: any }) {
  return new Promise((resolve, reject) => {
    const container = new Container();
    root.addChild(container);

    //@ts-ignore
    for (const prop in containerProps) {
      container[prop] = containerProps[prop];
    }
    setTimeout(() => {
      const views = [];
      for (let i = 0; i < 1000; i++) {
        const view = new Child();
        for (const prop in childProps) {
          view[prop] = childProps[prop];
        }
        container.addChild(view);
        views.push(view);
      }
      for (let prop in benchmarkProp) {
        const MARKER = `Setting ${prop} on ${Child.name} took`;
        console.time(MARKER);
        for (let view of views) {
          view[prop] = benchmarkProp[prop];
        }
        console.timeEnd(MARKER);
      }
      resolve(true);
    }, 1000);
  });
}

Application.run({
  create() {
    const root = new Div();
    //@ts-ignore
    root.width = '100%';
    //@ts-ignore
    root.height = '100%';

    setTimeout(async () => {
      await benchmark(
        root,
        Div,
        {
          width: '100%',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        },
        Div,
        {
          width: 100,
          height: 100,
          marginBottom: 10,
          backgroundColor: 'red',
        },
      );
      await benchmarkProp(
        root,
        Div,
        {
          width: '100%',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        },
        Div,
        {
          width: 100,
          height: 100,
          marginBottom: 10,
        },
        {
          backgroundColor: 'red',
        },
      );
    }, 5000);

    return root as never;
  },
});

/*
Application.run({
  create() {
    const root = new ScrollView();
    //@ts-ignore
    root.width = "100%";
    //@ts-ignore
    root.height = "100%";

    setTimeout(async () => {
      await benchmark(
        root,
        StackLayout,
        {
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        },
        StackLayout,
        {
          width: 100,
          height: 100,
          marginBottom: 10,
          backgroundColor: "red",
        }
      );
      await benchmarkProp(
        root,
        FlexboxLayout,
        {
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        },
        StackLayout,
        {
          width: 100,
          height: 100,
          marginBottom: 10,
        },
        {
          backgroundColor: "red",
        }
      );
    });

    return root;
  },
});

*/
