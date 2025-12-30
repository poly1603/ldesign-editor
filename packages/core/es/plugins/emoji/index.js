/*!
 * ***********************************
 * @ldesign/editor-core v3.0.0     *
 * Built with rollup               *
 * Build time: 2024-12-30 18:10:25 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createPlugin } from '../../core/Plugin.js';

const EMOJI_CATEGORIES = {
  smileys: {
    name: "\u7B11\u8138",
    emojis: ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}", "\u{1F618}", "\u{1F617}", "\u{1F619}", "\u{1F61A}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F61D}", "\u{1F911}", "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}", "\u{1F910}", "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F60F}", "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F925}", "\u{1F60C}", "\u{1F614}", "\u{1F62A}", "\u{1F924}", "\u{1F634}", "\u{1F637}", "\u{1F912}", "\u{1F915}", "\u{1F922}", "\u{1F92E}", "\u{1F927}", "\u{1F975}", "\u{1F976}", "\u{1F974}", "\u{1F635}", "\u{1F92F}", "\u{1F620}", "\u{1F621}", "\u{1F92C}", "\u{1F608}", "\u{1F47F}", "\u{1F480}", "\u2620\uFE0F", "\u{1F4A9}", "\u{1F921}", "\u{1F479}", "\u{1F47A}", "\u{1F47B}", "\u{1F47D}", "\u{1F47E}", "\u{1F916}", "\u{1F63A}", "\u{1F638}", "\u{1F639}", "\u{1F63B}", "\u{1F63C}", "\u{1F63D}", "\u{1F640}", "\u{1F63F}", "\u{1F63E}"]
  },
  gestures: {
    name: "\u624B\u52BF",
    emojis: ["\u{1F44B}", "\u{1F91A}", "\u{1F590}", "\u270B", "\u{1F596}", "\u{1F44C}", "\u{1F90F}", "\u270C\uFE0F", "\u{1F91E}", "\u{1F91F}", "\u{1F918}", "\u{1F919}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F595}", "\u{1F447}", "\u261D\uFE0F", "\u{1F44D}", "\u{1F44E}", "\u270A", "\u{1F44A}", "\u{1F91B}", "\u{1F91C}", "\u{1F44F}", "\u{1F64C}", "\u{1F450}", "\u{1F932}", "\u{1F91D}", "\u{1F64F}", "\u270D\uFE0F", "\u{1F485}", "\u{1F933}", "\u{1F4AA}"]
  },
  hearts: {
    name: "\u7231\u5FC3",
    emojis: ["\u2764\uFE0F", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}", "\u{1F49C}", "\u{1F5A4}", "\u{1F90D}", "\u{1F90E}", "\u{1F494}", "\u2763\uFE0F", "\u{1F495}", "\u{1F49E}", "\u{1F493}", "\u{1F497}", "\u{1F496}", "\u{1F498}", "\u{1F49D}", "\u{1F49F}", "\u262E\uFE0F", "\u271D\uFE0F", "\u262A\uFE0F", "\u{1F549}", "\u2638\uFE0F", "\u2721\uFE0F", "\u{1F52F}", "\u{1F54E}", "\u262F\uFE0F", "\u2626\uFE0F", "\u{1F6D0}", "\u26CE"]
  },
  animals: {
    name: "\u52A8\u7269",
    emojis: ["\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F439}", "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F428}", "\u{1F42F}", "\u{1F981}", "\u{1F42E}", "\u{1F437}", "\u{1F43D}", "\u{1F438}", "\u{1F435}", "\u{1F648}", "\u{1F649}", "\u{1F64A}", "\u{1F412}", "\u{1F414}", "\u{1F427}", "\u{1F426}", "\u{1F424}", "\u{1F423}", "\u{1F425}", "\u{1F986}", "\u{1F985}", "\u{1F989}", "\u{1F987}", "\u{1F43A}", "\u{1F417}", "\u{1F434}", "\u{1F984}", "\u{1F41D}", "\u{1F41B}", "\u{1F98B}", "\u{1F40C}", "\u{1F41E}", "\u{1F41C}", "\u{1F99F}", "\u{1F997}", "\u{1F577}", "\u{1F578}", "\u{1F982}", "\u{1F422}", "\u{1F40D}", "\u{1F98E}", "\u{1F996}", "\u{1F995}", "\u{1F419}", "\u{1F991}", "\u{1F990}", "\u{1F99E}", "\u{1F980}", "\u{1F421}", "\u{1F420}", "\u{1F41F}", "\u{1F42C}", "\u{1F433}", "\u{1F40B}", "\u{1F988}", "\u{1F40A}", "\u{1F405}", "\u{1F406}", "\u{1F993}", "\u{1F98D}", "\u{1F9A7}", "\u{1F418}", "\u{1F99B}", "\u{1F98F}", "\u{1F42A}", "\u{1F42B}", "\u{1F992}", "\u{1F998}", "\u{1F403}", "\u{1F402}", "\u{1F404}", "\u{1F40E}", "\u{1F416}", "\u{1F40F}", "\u{1F411}", "\u{1F999}", "\u{1F410}", "\u{1F98C}", "\u{1F415}", "\u{1F429}", "\u{1F9AE}", "\u{1F408}", "\u{1F413}", "\u{1F983}", "\u{1F99A}", "\u{1F99C}", "\u{1F9A2}", "\u{1F9A9}", "\u{1F54A}", "\u{1F407}", "\u{1F99D}", "\u{1F9A8}", "\u{1F9A1}", "\u{1F9A6}", "\u{1F9A5}", "\u{1F401}", "\u{1F400}", "\u{1F43F}", "\u{1F994}"]
  },
  food: {
    name: "\u98DF\u7269",
    emojis: ["\u{1F34F}", "\u{1F34E}", "\u{1F350}", "\u{1F34A}", "\u{1F34B}", "\u{1F34C}", "\u{1F349}", "\u{1F347}", "\u{1F353}", "\u{1F348}", "\u{1F352}", "\u{1F351}", "\u{1F96D}", "\u{1F34D}", "\u{1F965}", "\u{1F95D}", "\u{1F345}", "\u{1F346}", "\u{1F951}", "\u{1F966}", "\u{1F96C}", "\u{1F952}", "\u{1F336}", "\u{1F33D}", "\u{1F955}", "\u{1F9C4}", "\u{1F9C5}", "\u{1F954}", "\u{1F360}", "\u{1F950}", "\u{1F96F}", "\u{1F35E}", "\u{1F956}", "\u{1F968}", "\u{1F9C0}", "\u{1F95A}", "\u{1F373}", "\u{1F9C8}", "\u{1F95E}", "\u{1F9C7}", "\u{1F953}", "\u{1F969}", "\u{1F357}", "\u{1F356}", "\u{1F9B4}", "\u{1F32D}", "\u{1F354}", "\u{1F35F}", "\u{1F355}", "\u{1F96A}", "\u{1F959}", "\u{1F9C6}", "\u{1F32E}", "\u{1F32F}", "\u{1F957}", "\u{1F958}", "\u{1F96B}", "\u{1F35D}", "\u{1F35C}", "\u{1F372}", "\u{1F35B}", "\u{1F363}", "\u{1F371}", "\u{1F95F}", "\u{1F9AA}", "\u{1F364}", "\u{1F359}", "\u{1F35A}", "\u{1F358}", "\u{1F365}", "\u{1F960}", "\u{1F96E}", "\u{1F362}", "\u{1F361}", "\u{1F367}", "\u{1F368}", "\u{1F366}", "\u{1F967}", "\u{1F9C1}", "\u{1F370}", "\u{1F382}", "\u{1F36E}", "\u{1F36D}", "\u{1F36C}", "\u{1F36B}", "\u{1F37F}", "\u{1F369}", "\u{1F36A}", "\u{1F330}", "\u{1F95C}", "\u{1F36F}", "\u{1F95B}", "\u{1F37C}", "\u2615\uFE0F", "\u{1FAD6}", "\u{1F375}", "\u{1F9C3}", "\u{1F964}", "\u{1F376}", "\u{1F37A}", "\u{1F37B}", "\u{1F942}", "\u{1F377}", "\u{1F943}", "\u{1F378}", "\u{1F379}", "\u{1F9C9}", "\u{1F37E}", "\u{1F9CA}", "\u{1F944}", "\u{1F374}", "\u{1F37D}", "\u{1F963}", "\u{1F961}", "\u{1F962}", "\u{1F9C2}"]
  },
  activities: {
    name: "\u6D3B\u52A8",
    emojis: ["\u26BD\uFE0F", "\u{1F3C0}", "\u{1F3C8}", "\u26BE\uFE0F", "\u{1F94E}", "\u{1F3BE}", "\u{1F3D0}", "\u{1F3C9}", "\u{1F94F}", "\u{1F3B1}", "\u{1FA80}", "\u{1F3D3}", "\u{1F3F8}", "\u{1F3D2}", "\u{1F3D1}", "\u{1F94D}", "\u{1F3CF}", "\u26F3\uFE0F", "\u{1FA81}", "\u{1F3F9}", "\u{1F3A3}", "\u{1F93F}", "\u{1F94A}", "\u{1F94B}", "\u{1F3BD}", "\u{1F6F9}", "\u{1F6FC}", "\u{1F6F7}", "\u26F8", "\u{1F94C}", "\u{1F3BF}", "\u26F7", "\u{1F3C2}", "\u{1FA82}", "\u{1F3CB}\uFE0F\u200D\u2640\uFE0F", "\u{1F3CB}\uFE0F\u200D\u2642\uFE0F", "\u{1F93C}\u200D\u2640\uFE0F", "\u{1F93C}\u200D\u2642\uFE0F", "\u{1F938}\u200D\u2640\uFE0F", "\u{1F938}\u200D\u2642\uFE0F", "\u26F9\uFE0F\u200D\u2640\uFE0F", "\u26F9\uFE0F\u200D\u2642\uFE0F", "\u{1F93A}", "\u{1F93E}\u200D\u2640\uFE0F", "\u{1F93E}\u200D\u2642\uFE0F", "\u{1F3CC}\uFE0F\u200D\u2640\uFE0F", "\u{1F3CC}\uFE0F\u200D\u2642\uFE0F", "\u{1F3C7}", "\u{1F9D8}\u200D\u2640\uFE0F", "\u{1F9D8}\u200D\u2642\uFE0F", "\u{1F3C4}\u200D\u2640\uFE0F", "\u{1F3C4}\u200D\u2642\uFE0F", "\u{1F3CA}\u200D\u2640\uFE0F", "\u{1F3CA}\u200D\u2642\uFE0F", "\u{1F93D}\u200D\u2640\uFE0F", "\u{1F93D}\u200D\u2642\uFE0F", "\u{1F6A3}\u200D\u2640\uFE0F", "\u{1F6A3}\u200D\u2642\uFE0F", "\u{1F9D7}\u200D\u2640\uFE0F", "\u{1F9D7}\u200D\u2642\uFE0F", "\u{1F6B5}\u200D\u2640\uFE0F", "\u{1F6B5}\u200D\u2642\uFE0F", "\u{1F6B4}\u200D\u2640\uFE0F", "\u{1F6B4}\u200D\u2642\uFE0F", "\u{1F3C6}", "\u{1F947}", "\u{1F948}", "\u{1F949}", "\u{1F3C5}", "\u{1F396}", "\u{1F3F5}", "\u{1F397}", "\u{1F3AB}", "\u{1F39F}", "\u{1F3AA}", "\u{1F939}\u200D\u2640\uFE0F", "\u{1F939}\u200D\u2642\uFE0F", "\u{1F3AD}", "\u{1F3A8}", "\u{1F3AC}", "\u{1F3A4}", "\u{1F3A7}", "\u{1F3BC}", "\u{1F3B9}", "\u{1F941}", "\u{1F3B7}", "\u{1F3BA}", "\u{1F3B8}", "\u{1FA95}", "\u{1F3BB}", "\u{1F3B2}", "\u265F", "\u{1F3AF}", "\u{1F3B3}", "\u{1F3AE}", "\u{1F3B0}", "\u{1F9E9}"]
  },
  objects: {
    name: "\u7269\u54C1",
    emojis: ["\u231A\uFE0F", "\u{1F4F1}", "\u{1F4F2}", "\u{1F4BB}", "\u2328\uFE0F", "\u{1F5A5}", "\u{1F5A8}", "\u{1F5B1}", "\u{1F5B2}", "\u{1F579}", "\u{1F5DC}", "\u{1F4BD}", "\u{1F4BE}", "\u{1F4BF}", "\u{1F4C0}", "\u{1F4FC}", "\u{1F4F7}", "\u{1F4F8}", "\u{1F4F9}", "\u{1F3A5}", "\u{1F4FD}", "\u{1F39E}", "\u{1F4DE}", "\u260E\uFE0F", "\u{1F4DF}", "\u{1F4E0}", "\u{1F4FA}", "\u{1F4FB}", "\u{1F399}", "\u{1F39A}", "\u{1F39B}", "\u{1F9ED}", "\u23F1", "\u23F2", "\u23F0", "\u{1F570}", "\u231B\uFE0F", "\u23F3", "\u{1F4E1}", "\u{1F50B}", "\u{1F50C}", "\u{1F4A1}", "\u{1F526}", "\u{1F56F}", "\u{1FA94}", "\u{1F9EF}", "\u{1F6E2}", "\u{1F4B8}", "\u{1F4B5}", "\u{1F4B4}", "\u{1F4B6}", "\u{1F4B7}", "\u{1F4B0}", "\u{1F4B3}", "\u{1FA99}", "\u{1F48E}", "\u2696\uFE0F", "\u{1F9F0}", "\u{1F527}", "\u{1F528}", "\u2692", "\u{1F6E0}", "\u26CF", "\u{1F529}", "\u2699\uFE0F", "\u{1F9F1}", "\u26D3", "\u{1F9F2}", "\u{1F52B}", "\u{1F4A3}", "\u{1F9E8}", "\u{1FA93}", "\u{1F52A}", "\u{1F5E1}", "\u2694\uFE0F", "\u{1F6E1}", "\u{1F6AC}", "\u26B0\uFE0F", "\u{1FAA6}", "\u26B1\uFE0F", "\u{1F3FA}", "\u{1F52E}", "\u{1F4FF}", "\u{1F9FF}", "\u{1F488}", "\u2697\uFE0F", "\u{1F52D}", "\u{1F52C}", "\u{1F573}", "\u{1FA79}", "\u{1FA7A}", "\u{1F48A}", "\u{1F489}", "\u{1FA78}", "\u{1F9EC}", "\u{1F9A0}", "\u{1F9EB}", "\u{1F9EA}", "\u{1F321}", "\u{1F9F9}", "\u{1F9FA}", "\u{1F9FB}", "\u{1F6BD}", "\u{1F6B0}", "\u{1F6BF}", "\u{1F6C1}", "\u{1F6C0}", "\u{1F9FC}", "\u{1FAA5}", "\u{1FA92}", "\u{1F9FD}", "\u{1F9F4}", "\u{1F6CE}", "\u{1F511}", "\u{1F5DD}", "\u{1F6AA}", "\u{1FA91}", "\u{1F6CB}", "\u{1F6CF}", "\u{1F6CC}", "\u{1F9F8}", "\u{1F5BC}", "\u{1F6CD}", "\u{1F6D2}", "\u{1F381}", "\u{1F388}", "\u{1F38F}", "\u{1F380}", "\u{1F38A}", "\u{1F389}", "\u{1F38E}", "\u{1F3EE}", "\u{1F390}", "\u{1F9E7}", "\u2709\uFE0F", "\u{1F4E9}", "\u{1F4E8}", "\u{1F4E7}", "\u{1F48C}", "\u{1F4E5}", "\u{1F4E4}", "\u{1F4E6}", "\u{1F3F7}", "\u{1F4EA}", "\u{1F4EB}", "\u{1F4EC}", "\u{1F4ED}", "\u{1F4EE}", "\u{1F4EF}", "\u{1F4DC}", "\u{1F4C3}", "\u{1F4C4}", "\u{1F4D1}", "\u{1F9FE}", "\u{1F4CA}", "\u{1F4C8}", "\u{1F4C9}", "\u{1F5D2}", "\u{1F5D3}", "\u{1F4C6}", "\u{1F4C5}", "\u{1F5D1}", "\u{1F4C7}", "\u{1F5C3}", "\u{1F5F3}", "\u{1F5C4}", "\u{1F4CB}", "\u{1F4C1}", "\u{1F4C2}", "\u{1F5C2}", "\u{1F5DE}", "\u{1F4F0}", "\u{1F4D3}", "\u{1F4D4}", "\u{1F4D2}", "\u{1F4D5}", "\u{1F4D7}", "\u{1F4D8}", "\u{1F4D9}", "\u{1F4DA}", "\u{1F4D6}", "\u{1F516}", "\u{1F9F7}", "\u{1F517}", "\u{1F4CE}", "\u{1F587}", "\u{1F4D0}", "\u{1F4CF}", "\u{1F9EE}", "\u{1F4CC}", "\u{1F4CD}", "\u2702\uFE0F", "\u{1F58A}", "\u{1F58B}", "\u2712\uFE0F", "\u{1F58C}", "\u{1F58D}", "\u{1F4DD}", "\u270F\uFE0F", "\u{1F50D}", "\u{1F50E}", "\u{1F50F}", "\u{1F510}", "\u{1F512}", "\u{1F513}"]
  },
  symbols: {
    name: "\u7B26\u53F7",
    emojis: ["\u2764\uFE0F", "\u{1F494}", "\u{1F495}", "\u{1F496}", "\u{1F497}", "\u{1F498}", "\u{1F499}", "\u{1F49A}", "\u{1F49B}", "\u{1F49C}", "\u{1F5A4}", "\u{1F49D}", "\u{1F49E}", "\u{1F49F}", "\u2763\uFE0F", "\u{1F48C}", "\u{1F4A4}", "\u{1F4A2}", "\u{1F4A3}", "\u{1F4A5}", "\u{1F4A6}", "\u{1F4A8}", "\u{1F4AB}", "\u{1F4AC}", "\u{1F5E8}", "\u{1F5EF}", "\u{1F4AD}", "\u{1F573}", "\u{1F9B4}", "\u{1F9E0}", "\u{1FAC1}", "\u{1FAC0}", "\u{1F480}", "\u2620\uFE0F", "\u{1F4A9}", "\u{1F921}", "\u{1F479}", "\u{1F47A}", "\u{1F47B}", "\u{1F47D}", "\u{1F47E}", "\u{1F916}", "\u2728", "\u2B50\uFE0F", "\u{1F31F}", "\u{1F4AB}", "\u2728", "\u26A1\uFE0F", "\u2604\uFE0F", "\u{1F4A5}", "\u{1F525}", "\u{1F32A}", "\u{1F308}", "\u2600\uFE0F", "\u{1F324}", "\u26C5\uFE0F", "\u{1F325}", "\u2601\uFE0F", "\u{1F326}", "\u{1F327}", "\u26C8", "\u{1F329}", "\u{1F328}", "\u2744\uFE0F", "\u2603\uFE0F", "\u26C4\uFE0F", "\u{1F32C}", "\u{1F4A8}", "\u{1F4A7}", "\u{1F4A6}", "\u2614\uFE0F", "\u2602\uFE0F", "\u{1F30A}", "\u{1F32B}"]
  },
  travel: {
    name: "\u65C5\u884C",
    emojis: ["\u{1F697}", "\u{1F695}", "\u{1F699}", "\u{1F68C}", "\u{1F68E}", "\u{1F3CE}", "\u{1F693}", "\u{1F691}", "\u{1F692}", "\u{1F690}", "\u{1F69A}", "\u{1F69B}", "\u{1F69C}", "\u{1F6F4}", "\u{1F6B2}", "\u{1F6F5}", "\u{1F3CD}", "\u{1F6FA}", "\u{1F6A8}", "\u{1F694}", "\u{1F68D}", "\u{1F698}", "\u{1F696}", "\u{1F6A1}", "\u{1F6A0}", "\u{1F69F}", "\u{1F683}", "\u{1F68B}", "\u{1F69E}", "\u{1F69D}", "\u{1F684}", "\u{1F685}", "\u{1F688}", "\u{1F682}", "\u{1F686}", "\u{1F687}", "\u{1F68A}", "\u{1F689}", "\u2708\uFE0F", "\u{1F6EB}", "\u{1F6EC}", "\u{1F6E9}", "\u{1F4BA}", "\u{1F6F0}", "\u{1F680}", "\u{1F6F8}", "\u{1F681}", "\u{1F6F6}", "\u26F5\uFE0F", "\u{1F6A4}", "\u{1F6E5}", "\u{1F6F3}", "\u26F4", "\u{1F6A2}", "\u2693\uFE0F", "\u26FD\uFE0F", "\u{1F6A7}", "\u{1F6A6}", "\u{1F6A5}", "\u{1F68F}", "\u{1F5FA}", "\u{1F5FF}", "\u{1F5FD}", "\u{1F5FC}", "\u{1F3F0}", "\u{1F3EF}", "\u{1F3DF}", "\u{1F3A1}", "\u{1F3A2}", "\u{1F3A0}", "\u26F2\uFE0F", "\u26F1", "\u{1F3D6}", "\u{1F3DD}", "\u{1F3DC}", "\u{1F30B}", "\u26F0", "\u{1F3D4}", "\u{1F5FB}", "\u{1F3D5}", "\u26FA\uFE0F", "\u{1F3E0}", "\u{1F3E1}", "\u{1F3D8}", "\u{1F3DA}", "\u{1F3D7}", "\u{1F3ED}", "\u{1F3E2}", "\u{1F3EC}", "\u{1F3E3}", "\u{1F3E4}", "\u{1F3E5}", "\u{1F3E6}", "\u{1F3E8}", "\u{1F3EA}", "\u{1F3EB}", "\u{1F3E9}", "\u{1F492}", "\u{1F3DB}", "\u26EA\uFE0F", "\u{1F54C}", "\u{1F54D}", "\u{1F6D5}", "\u{1F54B}", "\u26E9", "\u{1F6E4}", "\u{1F6E3}", "\u{1F5FE}", "\u{1F391}", "\u{1F3DE}", "\u{1F305}", "\u{1F304}", "\u{1F320}", "\u{1F387}", "\u{1F386}", "\u{1F307}", "\u{1F306}", "\u{1F3D9}", "\u{1F303}", "\u{1F30C}", "\u{1F309}", "\u{1F301}"]
  },
  flags: {
    name: "\u65D7\u5E1C",
    emojis: ["\u{1F3F3}\uFE0F", "\u{1F3F4}", "\u{1F3F4}\u200D\u2620\uFE0F", "\u{1F3C1}", "\u{1F6A9}", "\u{1F3F3}\uFE0F\u200D\u{1F308}", "\u{1F3F3}\uFE0F\u200D\u26A7\uFE0F", "\u{1F1E6}\u{1F1EB}", "\u{1F1E6}\u{1F1FD}", "\u{1F1E6}\u{1F1F1}", "\u{1F1E9}\u{1F1FF}", "\u{1F1E6}\u{1F1F8}", "\u{1F1E6}\u{1F1E9}", "\u{1F1E6}\u{1F1F4}", "\u{1F1E6}\u{1F1EE}", "\u{1F1E6}\u{1F1F6}", "\u{1F1E6}\u{1F1EC}", "\u{1F1E6}\u{1F1F7}", "\u{1F1E6}\u{1F1F2}", "\u{1F1E6}\u{1F1FC}", "\u{1F1E6}\u{1F1FA}", "\u{1F1E6}\u{1F1F9}", "\u{1F1E6}\u{1F1FF}", "\u{1F1E7}\u{1F1F8}", "\u{1F1E7}\u{1F1ED}", "\u{1F1E7}\u{1F1E9}", "\u{1F1E7}\u{1F1E7}", "\u{1F1E7}\u{1F1FE}", "\u{1F1E7}\u{1F1EA}", "\u{1F1E7}\u{1F1FF}", "\u{1F1E7}\u{1F1EF}", "\u{1F1E7}\u{1F1F2}", "\u{1F1E7}\u{1F1F9}", "\u{1F1E7}\u{1F1F4}", "\u{1F1E7}\u{1F1E6}", "\u{1F1E7}\u{1F1FC}", "\u{1F1E7}\u{1F1F7}", "\u{1F1EE}\u{1F1F4}", "\u{1F1FB}\u{1F1EC}", "\u{1F1E7}\u{1F1F3}", "\u{1F1E7}\u{1F1EC}", "\u{1F1E7}\u{1F1EB}", "\u{1F1E7}\u{1F1EE}", "\u{1F1F0}\u{1F1ED}", "\u{1F1E8}\u{1F1F2}", "\u{1F1E8}\u{1F1E6}", "\u{1F1EE}\u{1F1E8}", "\u{1F1E8}\u{1F1FB}", "\u{1F1E7}\u{1F1F6}", "\u{1F1F0}\u{1F1FE}", "\u{1F1E8}\u{1F1EB}", "\u{1F1F9}\u{1F1E9}", "\u{1F1E8}\u{1F1F1}", "\u{1F1E8}\u{1F1F3}", "\u{1F1E8}\u{1F1FD}", "\u{1F1E8}\u{1F1E8}", "\u{1F1E8}\u{1F1F4}", "\u{1F1F0}\u{1F1F2}", "\u{1F1E8}\u{1F1EC}", "\u{1F1E8}\u{1F1E9}", "\u{1F1E8}\u{1F1F0}", "\u{1F1E8}\u{1F1F7}", "\u{1F1E8}\u{1F1EE}", "\u{1F1ED}\u{1F1F7}", "\u{1F1E8}\u{1F1FA}", "\u{1F1E8}\u{1F1FC}", "\u{1F1E8}\u{1F1FE}", "\u{1F1E8}\u{1F1FF}", "\u{1F1E9}\u{1F1F0}", "\u{1F1E9}\u{1F1EF}", "\u{1F1E9}\u{1F1F2}", "\u{1F1E9}\u{1F1F4}", "\u{1F1EA}\u{1F1E8}", "\u{1F1EA}\u{1F1EC}", "\u{1F1F8}\u{1F1FB}", "\u{1F1EC}\u{1F1F6}", "\u{1F1EA}\u{1F1F7}", "\u{1F1EA}\u{1F1EA}", "\u{1F1F8}\u{1F1FF}", "\u{1F1EA}\u{1F1F9}", "\u{1F1EA}\u{1F1FA}", "\u{1F1EB}\u{1F1F0}", "\u{1F1EB}\u{1F1F4}", "\u{1F1EB}\u{1F1EF}", "\u{1F1EB}\u{1F1EE}", "\u{1F1EB}\u{1F1F7}", "\u{1F1EC}\u{1F1EB}", "\u{1F1F5}\u{1F1EB}", "\u{1F1F9}\u{1F1EB}", "\u{1F1EC}\u{1F1E6}", "\u{1F1EC}\u{1F1F2}", "\u{1F1EC}\u{1F1EA}", "\u{1F1E9}\u{1F1EA}", "\u{1F1EC}\u{1F1ED}", "\u{1F1EC}\u{1F1EE}", "\u{1F1EC}\u{1F1F7}", "\u{1F1EC}\u{1F1F1}", "\u{1F1EC}\u{1F1E9}", "\u{1F1EC}\u{1F1F5}", "\u{1F1EC}\u{1F1FA}", "\u{1F1EC}\u{1F1F9}", "\u{1F1EC}\u{1F1EC}", "\u{1F1EC}\u{1F1F3}", "\u{1F1EC}\u{1F1FC}", "\u{1F1EC}\u{1F1FE}", "\u{1F1ED}\u{1F1F9}", "\u{1F1ED}\u{1F1F3}", "\u{1F1ED}\u{1F1F0}", "\u{1F1ED}\u{1F1FA}", "\u{1F1EE}\u{1F1F8}", "\u{1F1EE}\u{1F1F3}", "\u{1F1EE}\u{1F1E9}", "\u{1F1EE}\u{1F1F7}", "\u{1F1EE}\u{1F1F6}", "\u{1F1EE}\u{1F1EA}", "\u{1F1EE}\u{1F1F2}", "\u{1F1EE}\u{1F1F1}", "\u{1F1EE}\u{1F1F9}", "\u{1F1EF}\u{1F1F2}", "\u{1F1EF}\u{1F1F5}", "\u{1F38C}", "\u{1F1EF}\u{1F1EA}", "\u{1F1EF}\u{1F1F4}", "\u{1F1F0}\u{1F1FF}", "\u{1F1F0}\u{1F1EA}", "\u{1F1F0}\u{1F1EE}", "\u{1F1FD}\u{1F1F0}", "\u{1F1F0}\u{1F1FC}", "\u{1F1F0}\u{1F1EC}", "\u{1F1F1}\u{1F1E6}", "\u{1F1F1}\u{1F1FB}", "\u{1F1F1}\u{1F1E7}", "\u{1F1F1}\u{1F1F8}", "\u{1F1F1}\u{1F1F7}", "\u{1F1F1}\u{1F1FE}", "\u{1F1F1}\u{1F1EE}", "\u{1F1F1}\u{1F1F9}", "\u{1F1F1}\u{1F1FA}", "\u{1F1F2}\u{1F1F4}", "\u{1F1F2}\u{1F1EC}", "\u{1F1F2}\u{1F1FC}", "\u{1F1F2}\u{1F1FE}", "\u{1F1F2}\u{1F1FB}", "\u{1F1F2}\u{1F1F1}", "\u{1F1F2}\u{1F1F9}", "\u{1F1F2}\u{1F1ED}", "\u{1F1F2}\u{1F1F6}", "\u{1F1F2}\u{1F1F7}", "\u{1F1F2}\u{1F1FA}", "\u{1F1FE}\u{1F1F9}", "\u{1F1F2}\u{1F1FD}", "\u{1F1EB}\u{1F1F2}", "\u{1F1F2}\u{1F1E9}", "\u{1F1F2}\u{1F1E8}", "\u{1F1F2}\u{1F1F3}", "\u{1F1F2}\u{1F1EA}", "\u{1F1F2}\u{1F1F8}", "\u{1F1F2}\u{1F1E6}", "\u{1F1F2}\u{1F1FF}", "\u{1F1F2}\u{1F1F2}", "\u{1F1F3}\u{1F1E6}", "\u{1F1F3}\u{1F1F7}", "\u{1F1F3}\u{1F1F5}", "\u{1F1F3}\u{1F1F1}", "\u{1F1F3}\u{1F1E8}", "\u{1F1F3}\u{1F1FF}", "\u{1F1F3}\u{1F1EE}", "\u{1F1F3}\u{1F1EA}", "\u{1F1F3}\u{1F1EC}", "\u{1F1F3}\u{1F1FA}", "\u{1F1F3}\u{1F1EB}", "\u{1F1F0}\u{1F1F5}", "\u{1F1F2}\u{1F1F0}", "\u{1F1F2}\u{1F1F5}", "\u{1F1F3}\u{1F1F4}", "\u{1F1F4}\u{1F1F2}", "\u{1F1F5}\u{1F1F0}", "\u{1F1F5}\u{1F1FC}", "\u{1F1F5}\u{1F1F8}", "\u{1F1F5}\u{1F1E6}", "\u{1F1F5}\u{1F1EC}", "\u{1F1F5}\u{1F1FE}", "\u{1F1F5}\u{1F1EA}", "\u{1F1F5}\u{1F1ED}", "\u{1F1F5}\u{1F1F3}", "\u{1F1F5}\u{1F1F1}", "\u{1F1F5}\u{1F1F9}", "\u{1F1F5}\u{1F1F7}", "\u{1F1F6}\u{1F1E6}", "\u{1F1F7}\u{1F1EA}", "\u{1F1F7}\u{1F1F4}", "\u{1F1F7}\u{1F1FA}", "\u{1F1F7}\u{1F1FC}", "\u{1F1FC}\u{1F1F8}", "\u{1F1F8}\u{1F1F2}", "\u{1F1F8}\u{1F1F9}", "\u{1F1F8}\u{1F1E6}", "\u{1F1F8}\u{1F1F3}", "\u{1F1F7}\u{1F1F8}", "\u{1F1F8}\u{1F1E8}", "\u{1F1F8}\u{1F1F1}", "\u{1F1F8}\u{1F1EC}", "\u{1F1F8}\u{1F1FD}", "\u{1F1F8}\u{1F1F0}", "\u{1F1F8}\u{1F1EE}", "\u{1F1EC}\u{1F1F8}", "\u{1F1F8}\u{1F1E7}", "\u{1F1F8}\u{1F1F4}", "\u{1F1FF}\u{1F1E6}", "\u{1F1F0}\u{1F1F7}", "\u{1F1F8}\u{1F1F8}", "\u{1F1EA}\u{1F1F8}", "\u{1F1F1}\u{1F1F0}", "\u{1F1E7}\u{1F1F1}", "\u{1F1F8}\u{1F1ED}", "\u{1F1F0}\u{1F1F3}", "\u{1F1F1}\u{1F1E8}", "\u{1F1F5}\u{1F1F2}", "\u{1F1FB}\u{1F1E8}", "\u{1F1F8}\u{1F1E9}", "\u{1F1F8}\u{1F1F7}", "\u{1F1F8}\u{1F1EA}", "\u{1F1E8}\u{1F1ED}", "\u{1F1F8}\u{1F1FE}", "\u{1F1F9}\u{1F1FC}", "\u{1F1F9}\u{1F1EF}", "\u{1F1F9}\u{1F1FF}", "\u{1F1F9}\u{1F1ED}", "\u{1F1F9}\u{1F1F1}", "\u{1F1F9}\u{1F1EC}", "\u{1F1F9}\u{1F1F0}", "\u{1F1F9}\u{1F1F4}", "\u{1F1F9}\u{1F1F9}", "\u{1F1F9}\u{1F1F3}", "\u{1F1F9}\u{1F1F7}", "\u{1F1F9}\u{1F1F2}", "\u{1F1F9}\u{1F1E8}", "\u{1F1F9}\u{1F1FB}", "\u{1F1FB}\u{1F1EE}", "\u{1F1FA}\u{1F1EC}", "\u{1F1FA}\u{1F1E6}", "\u{1F1E6}\u{1F1EA}", "\u{1F1EC}\u{1F1E7}", "\u{1F3F4}\u{D0067}\u{D0062}\u{D0065}\u{D006E}\u{D0067}\u{D007F}", "\u{1F3F4}\u{D0067}\u{D0062}\u{D0073}\u{D0063}\u{D0074}\u{D007F}", "\u{1F3F4}\u{D0067}\u{D0062}\u{D0077}\u{D006C}\u{D0073}\u{D007F}", "\u{1F1FA}\u{1F1F3}", "\u{1F1FA}\u{1F1F8}", "\u{1F1FA}\u{1F1FE}", "\u{1F1FA}\u{1F1FF}", "\u{1F1FB}\u{1F1FA}", "\u{1F1FB}\u{1F1E6}", "\u{1F1FB}\u{1F1EA}", "\u{1F1FB}\u{1F1F3}", "\u{1F1FC}\u{1F1EB}", "\u{1F1EA}\u{1F1ED}", "\u{1F1FE}\u{1F1EA}", "\u{1F1FF}\u{1F1F2}", "\u{1F1FF}\u{1F1FC}"]
  }
};
function createEmojiPicker(onSelect) {
  const picker = document.createElement("div");
  picker.className = "ldesign-emoji-picker";
  picker.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 8px;
    width: 380px;
    max-height: 320px;
    overflow-y: auto;
    z-index: 10000;
    animation: fadeIn 0.2s ease-out;
  `;
  const tabs = document.createElement("div");
  tabs.style.cssText = `
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
  `;
  const emojiContainer = document.createElement("div");
  emojiContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  `;
  Object.entries(EMOJI_CATEGORIES).forEach(([key, category], index) => {
    const tab = document.createElement("button");
    tab.textContent = category.name;
    tab.style.cssText = `
      padding: 4px 12px;
      border: none;
      background: ${index === 0 ? "#4f46e5" : "#f3f4f6"};
      color: ${index === 0 ? "white" : "#374151"};
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    `;
    tab.onmouseover = () => {
      if (tab.style.backgroundColor !== "rgb(79, 70, 229)")
        tab.style.backgroundColor = "#e5e7eb";
    };
    tab.onmouseout = () => {
      if (tab.style.backgroundColor !== "rgb(79, 70, 229)")
        tab.style.backgroundColor = "#f3f4f6";
    };
    tab.onclick = () => {
      tabs.querySelectorAll("button").forEach((btn) => {
        btn.style.backgroundColor = "#f3f4f6";
        btn.style.color = "#374151";
      });
      tab.style.backgroundColor = "#4f46e5";
      tab.style.color = "white";
      emojiContainer.innerHTML = "";
      category.emojis.forEach((emoji) => {
        const emojiBtn = document.createElement("button");
        emojiBtn.textContent = emoji;
        emojiBtn.style.cssText = `
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          border-radius: 4px;
          transition: background 0.2s;
        `;
        emojiBtn.onmouseover = () => {
          emojiBtn.style.backgroundColor = "#f3f4f6";
        };
        emojiBtn.onmouseout = () => {
          emojiBtn.style.backgroundColor = "transparent";
        };
        emojiBtn.onclick = () => {
          onSelect(emoji);
          picker.remove();
        };
        emojiContainer.appendChild(emojiBtn);
      });
    };
    tabs.appendChild(tab);
    if (index === 0)
      tab.click();
  });
  picker.appendChild(tabs);
  picker.appendChild(emojiContainer);
  setTimeout(() => {
    const closeOnClickOutside = (e) => {
      const target = e.target;
      const emojiButton = document.querySelector('[data-name="emoji"]');
      if (emojiButton && emojiButton.contains(target))
        return;
      if (!picker.contains(target)) {
        picker.remove();
        document.removeEventListener("click", closeOnClickOutside);
      }
    };
    document.addEventListener("click", closeOnClickOutside);
  }, 100);
  return picker;
}
const insertEmoji = (state, dispatch) => {
  if (!dispatch)
    return true;
  const existingPicker = document.querySelector(".ldesign-emoji-picker");
  if (existingPicker) {
    existingPicker.remove();
    return true;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0)
    return false;
  const range = selection.getRangeAt(0);
  const picker = createEmojiPicker((emoji) => {
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("insertText", false, emoji);
  });
  const button = window.event?.target?.closest('[data-name="emoji"]') || document.querySelector('[data-name="emoji"]');
  if (button) {
    const rect = button.getBoundingClientRect();
    window.pageYOffset || document.documentElement.scrollTop;
    window.pageXOffset || document.documentElement.scrollLeft;
    picker.style.position = "fixed";
    picker.style.top = `${rect.bottom + 5}px`;
    picker.style.left = `${rect.left}px`;
    setTimeout(() => {
      const pickerRect = picker.getBoundingClientRect();
      if (pickerRect.right > window.innerWidth)
        picker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
      if (pickerRect.bottom > window.innerHeight) {
        picker.style.top = `${rect.top - pickerRect.height - 5}px`;
      }
    }, 0);
  }
  document.body.appendChild(picker);
  return true;
};
const EmojiPlugin = createPlugin({
  name: "emoji",
  commands: {
    insertEmoji
  },
  toolbar: [{
    name: "emoji",
    title: "\u63D2\u5165\u8868\u60C5",
    icon: "emoji",
    command: insertEmoji
  }]
});

export { EmojiPlugin };
/*! End of @ldesign/editor-core | Powered by @ldesign/builder */
//# sourceMappingURL=index.js.map
