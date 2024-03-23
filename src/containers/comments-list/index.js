import {memo, useCallback, useEffect, useState} from 'react';
import useSelector from '../../hooks/use-selector';
import {useDispatch, useSelector as useSelectorRedux} from 'react-redux';
import useTranslate from '../../hooks/use-translate';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import ItemComment from '../../components/item-comment';
import treeToList from '../../utils/tree-to-list';
import listToTree from '../../utils/list-to-tree';
import CommentForm from '../../components/comment-form';
import Comments from '../../components/comments';
import commentsActions from '../../store-redux/comments/actions';

function CommentsList(props) {

  const dispatch = useDispatch();
  const {lang, t} = useTranslate();

  const [parent, setParent] = useState(props.parent);

  const session = useSelector(state => ({
    exists: state.session.exists,
    user: state.session.user
  }));

  const select = useSelectorRedux(state => ({
    items: state.comments.items,
    count: state.comments.count,
    waiting: state.comments.waiting,
    sending: state.comments.sending
  }), shallowequal);

  const cancelAnswer = () => setParent(props.parent);

  useEffect(
    () => {
      if (!select.sending) {
        cancelAnswer();
      }
    },
    [select.sending]
  )

  const callbacks = {
    // Отправка комментария
    send: useCallback(text => dispatch(commentsActions.send(session.user, parent, text))),
  }

  const renders = {
    item: useCallback(item => (
      <>
        <ItemComment item={item} lang={lang} onAnswer={setParent}/>
        { parent._id === item._id &&
            <CommentForm
              title={t('comments.newAnswer')}
              placeholder={t('comments.text')}
              labelSend={t('comments.send')}
              labelCancel={t('comments.cancel')}
              exists={session.exists}
              onCancel={cancelAnswer}
              isCancelable={true}
              inviteUrl='/login/'
              disabled={select.sending}
              onSubmit={callbacks.send}/>
        }
      </>
    ), [lang, parent]),
  };

  const items = treeToList(listToTree(select.items), (item, level) => (
    {...item, padding: (level - 1) * 30}
  )).splice(1);

  return (
    <>
      <Comments items={items} renderItem={renders.item} title={t('comments') + ` (${select.count})`} />
      { parent._id === props.parent._id &&
          <CommentForm
            title={t('comments.newComment')}
            placeholder={t('comments.text')}
            labelSend={t('comments.send')}
            exists={session.exists}
            inviteUrl='/login/'
            disabled={select.sending}
            onSubmit={callbacks.send}/>
      }
    </>
  );
}

CommentsList.propTypes = {
  parent: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _type: PropTypes.string
  }).isRequired,
  count: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    author: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      profile: PropTypes.shape({name: PropTypes.string})
    }),
    dateCreate: PropTypes.string,
    text: PropTypes.string,
    isDeleted: PropTypes.bool,
  }))
};

CommentsList.defaultProps = {
  count: 0,
  items: []
}

export default memo(CommentsList);