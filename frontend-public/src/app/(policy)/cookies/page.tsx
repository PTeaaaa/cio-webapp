import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "เกี่ยวกับ Cookies",
    description: "Cookies Page",
    icons: "/assets/MOPHLogo.svg",
}

export default async function Privacy() {
    return (
        <div className="min-h-screen bg-[#202124] text-zinc-400 font-prompt">
            <div className="p-8">
                <h1 className="flex py-4 justify-center text-[1.5rem]">About Cookies</h1>
                <div className="bg-black h-[1px] mb-8" />

                <div className="mb-4">
                    <h2 className="font-bold mb-1">How do we use cookies on this board?</h2>
                    <p className="indent-7">
                        We use files known as cookies on ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง to improve its performance and to enhance your user experience. By using ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง you agree that we can place these types of files on your device.
                    </p>
                </div>

                <div className="mb-4">
                    <h2 className="font-bold mb-1">What are cookies?</h2>
                    <p className="mb-2 indent-7">
                        Cookies are small text files that a website may put on your computer, or mobile device, when you first visit that site or one of its pages.
                    </p>
                    <p className="mb-2 indent-7">
                        There are many functions that a cookie can serve. For example, a cookie will help the website, or another website, to recognise your device the next time you visit it. ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง uses the term "cookies" in this policy to refer to all files that collect information in this way.
                    </p>
                    <p className="mb-2 indent-7">
                        Certain cookies contain personal information - for example, if you click on "remember me" when logging on, a cookie will store your username. Most cookies will not collect information that identifies you, but will instead collect more general information such as how users arrive at and use ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง, or a user's general location.
                    </p>
                </div>

                <div className="mb-4">
                    <h2 className="font-bold mb-1">What sort of cookies does ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง use?</h2>
                    <p className="mb-2 indent-7">
                        Cookies can perform several different functions:
                    </p>
                    <p className="mb-2 indent-7">
                        1. Necessary Cookies
                        Some cookies are essential for the operation of ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง. These cookies enable services you have specifically asked for.
                    </p>
                    <p className="mb-2 indent-7">
                        2. Performance Cookies
                        These cookies may collect anonymous information on the pages visited. For example, we might use performance cookies to keep track of which pages are most popular, which method of linking between pages is most effective and to determine why some pages are receiving error messages.
                    </p>
                    <p className="mb-2 indent-7">
                        3. Functionality Cookies
                        These cookies remember choices you make to improve your experience.
                    </p>
                    <p className="mb-2 indent-7">
                        ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง may also allow third parties to serve cookies that fall into any of the categories above. For example, like many sites, we may use Google Analytics to help us monitor our website traffic.
                    </p>
                </div>

                <div className="mb-4">
                    <h2 className="font-bold mb-1">Can a board user block cookies?</h2>
                    <p className="mb-2 indent-7">
                        To find out how to manage which cookies you allow, see your browser's help section or your mobile device manual - or you can visit one of the sites below, which have detailed information on how to manage, control or delete cookies.
                    </p>
                </div>

                <div className="mb-4">
                    <h2>For more information :</h2>
                    <div className="indent-7 hover:text-[#14774a] transition-all duration-100 w-fit">
                        <a href="https://www.aboutcookies.org/">https://www.aboutcookies.org/</a>
                    </div>
                    <div className="indent-7 hover:text-[#14774a] transition-all duration-100 w-fit">
                        <a href="https://allaboutcookies.org/">https://allaboutcookies.org/</a>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="mb-2">
                        Please remember that if you do choose to disable cookies, you may find that certain sections of ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง do not work properly.
                    </p>
                </div>

                <div className="mb-4">
                    <h2 className="font-bold mb-1">Cookies on ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง from social networking sites</h2>
                    <p className="mb-2 indent-7">
                        ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง may have links to social networking websites (e.g. Facebook, Twitter or YouTube). These websites may also place cookies on your device and ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง does not control how they use their cookies, therefore ผู้บริหารเทคโนโลยีสารสนเทศระดับสูง suggests you check their website(s) to see how they are using cookies.
                    </p>
                </div>



                <div className="bg-black h-[1px] my-8" />

            </div>
        </div>
    );
}