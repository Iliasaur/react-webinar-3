import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./main";
import Basket from "./basket";
import Article from "./article";
import useSelector from "../store/use-selector";

/**
 * Приложение
 * @returns {React.ReactElement}
 */
function App() {

  const activeModal = useSelector(state => state.modals.name);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main/> } />
          <Route path="article/:articleId" element={<Article/> } />
        </Routes>
        {activeModal === 'basket' && <Basket/>}
      </BrowserRouter>
    </>
  )
}

export default App;